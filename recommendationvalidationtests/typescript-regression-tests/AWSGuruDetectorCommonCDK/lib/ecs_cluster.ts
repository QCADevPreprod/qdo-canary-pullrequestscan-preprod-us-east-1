import cdk = require('monocdk');
import ecs = require('monocdk/aws-ecs');
import ec2 = require('monocdk/aws-ec2');
import iam = require('monocdk/aws-iam');
import autoscaling = require('monocdk/aws-autoscaling');
import {CfnOutput, Duration} from "monocdk";
import {DeploymentEnvironment, DeploymentStack, DogmaTagsOptions, SoftwareType} from '@amzn/pipelines';
import {containerInstanceUtilizationRatioMetric, sqsNumberOfMessagesVisibleMetric} from './constants/metrics';
import {installChronicleAgentScript, installChronicleForASG, installSinglePassBootstrapScript} from "./chronicle";
import {Asset} from "monocdk/aws-s3-assets";
import {
    LOWER_SQS_THRESHOLD,
    LOWER_THRESHOLD,
    MAX_TASKS_PER_HOST,
    UPPER_SQS_THRESHOLD_STEP1,
    UPPER_SQS_THRESHOLD_STEP2,
    UPPER_SQS_THRESHOLD_STEP3,
    UPPER_THRESHOLD_STEP1
} from './constants/autoscalingThresholds';
import {
    ASG_ROLLING_UPDATE_BATCH_SIZE_PERC,
    ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES,
    PREPROD_ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES
} from "./constants/ec2_config";
import {PREPROD_STAGE} from "./constants/stages";
import {UserDataScriptInitializer} from "./construct/user_data_provider";
import {IVpc} from "monocdk/aws-ec2";
import {WarmPool} from "./construct/warm_pool";
import {BlockDeviceVolume, EbsDeviceVolumeType} from "monocdk/aws-autoscaling";

export interface EcsClusterStackProps {
    readonly clusterName: string;
    readonly vpc: ec2.IVpc;
    readonly env: DeploymentEnvironment;
    readonly stackName?: string;
    /**
     * Stack tags that will be applied to all the taggable resources and the stack itself.
     *
     * @default {}
     */
    readonly tags?: {
        [key: string]: string;
    };
    /**
     * Optional Dogma tags. Read `DogmaTags` for mode details or
     * this wiki https://w.amazon.com/bin/view/ReleaseExcellence/Team/Designs/PDGTargetSupport/Tags/
     */
    readonly dogmaTags?: DogmaTagsOptions;
}

export class EcsClusterStack extends DeploymentStack {
    readonly cluster: ecs.Cluster;
    private vpcIdOutput: CfnOutput;
    readonly env: DeploymentEnvironment;
    private asg: autoscaling.AutoScalingGroup;
    readonly chronicleAgentScript : Asset;
    readonly singlePassBootstrapScript : Asset;

    constructor(parent: cdk.App, name: string, props: EcsClusterStackProps) {
        super(parent, name, {
            softwareType: SoftwareType.INFRASTRUCTURE,
            dogmaTags: props.dogmaTags,
            env: props.env,
            stackName: props.stackName,
            tags: props.tags,
        });

        // CloudFormation Resources
        this.cluster = new ecs.Cluster(this, 'Cluster', {
            vpc: props.vpc,
            clusterName: props.clusterName,
            containerInsights: true
        });

        //Forcing CDK to export the VPC for backward compatibility when switching from EC2 to Fargate
        this.vpcIdOutput = new CfnOutput(this, 'VpcId', {
            value: this.cluster.vpc.vpcId
        });
        this.env = props.env;

        this.chronicleAgentScript = installChronicleAgentScript(this);
        this.singlePassBootstrapScript = installSinglePassBootstrapScript(this);

        const enableCfnHup = new cdk.CfnParameter(this, 'EnableCfnHup', {
            type: 'String',
            default: 'false',
            allowedValues: ['true', 'false']
        });
        const enableOnBoot = new cdk.CfnParameter(this, 'EnablePatchOnBoot', {
          type: 'String',
          default: 'true',
          allowedValues: ['true', 'false']
        });
    }

    public addAutoScalingPolicy(appPrefix: string, tasksPerInstance: number = MAX_TASKS_PER_HOST,
                                 lowerThreshold: number = LOWER_THRESHOLD,
                                 upperThreshold1: number = UPPER_THRESHOLD_STEP1,
                                 upperThreshold2: number = UPPER_THRESHOLD_STEP1,
                                 upperThreshold3: number = UPPER_THRESHOLD_STEP1)  {
        this.asg.scaleOnMetric('${this.cluster.clusterName}-ScalingPolicy', {
              metric: containerInstanceUtilizationRatioMetric(appPrefix, tasksPerInstance),
              //If the container utilization <= LOWER_THRESHOLD, we can scale in the fleet down to the minCapacity.
              //If the container utilization > UPPER_THRESHOLD_STEP1, we add 6 hosts.
              scalingSteps: [
                { lower: 0, upper: lowerThreshold, change: -6 },
                { lower: upperThreshold1, change: +6 },
              ],
              adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
              estimatedInstanceWarmup: cdk.Duration.seconds(60)
        });
    }

    public addSqsAutoScalingPolicy(queueName : string,
                                 lowerThreshold: number = LOWER_SQS_THRESHOLD,
                                 upperThreshold1: number = UPPER_SQS_THRESHOLD_STEP1,
                                 upperThreshold2: number = UPPER_SQS_THRESHOLD_STEP2,
                                 upperThreshold3: number = UPPER_SQS_THRESHOLD_STEP3)  {
        this.asg.scaleOnMetric('${this.cluster.clusterName}-SqsScalingPolicy', {
              metric: sqsNumberOfMessagesVisibleMetric(queueName),
              //If the size of the queue <= LOWER_SQS_THRESHOLD, we can scale in the fleet down to the minCapacity.
              //If the size of the queue is > UPPER_SQS_THRESHOLD_STEP1, we add 6 host.
              scalingSteps: [
                { lower: 0, upper: lowerThreshold, change: -6 },
                { lower: upperThreshold1, change: +6 },
              ],
              adjustmentType: autoscaling.AdjustmentType.CHANGE_IN_CAPACITY,
              estimatedInstanceWarmup: cdk.Duration.seconds(60)
        });
    }

    public addEc2Capacity(vpc: IVpc, instanceType: string, minCapacity: number,
                          maxCapacity: number, stage: string, appPrefix: string,
                          warmPoolMinSize?: number): any {

        const userDataScriptInitializer = new UserDataScriptInitializer();

        this.asg = new autoscaling.AutoScalingGroup(this, 'DefaultASGCapacity', {
            instanceType: new ec2.InstanceType(instanceType),
            machineImage: ecs.EcsOptimizedImage.amazonLinux2(),
            minCapacity: minCapacity,
            maxCapacity: maxCapacity,
            vpc: vpc,
            updatePolicy: autoscaling.UpdatePolicy.rollingUpdate({
                maxBatchSize: Math.max(1, Math.floor(minCapacity * ASG_ROLLING_UPDATE_BATCH_SIZE_PERC)),
                minInstancesInService: minCapacity,
                pauseTime: (PREPROD_STAGE === stage) ? Duration.minutes(PREPROD_ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES)
                    : Duration.minutes(ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES),
            }),
            blockDevices: [
                {
                    deviceName: '/dev/xvda',
                    volume: autoscaling.BlockDeviceVolume.ebs(120,{
                        encrypted: false,
                        deleteOnTermination: true,
                        volumeType: autoscaling.EbsDeviceVolumeType.GP3,
                        // GP3 volumes must have between 3000 and 16000 IOPS
                        iops: 3000,
                    })
                }
            ],
            userData: userDataScriptInitializer.getUserData(),
        });

        const capacityProviderName = `${this.stripAppPrefix(appPrefix)}ASGCapacityProvider`;
        const capacityProvider = new ecs.AsgCapacityProvider(this, 'AsgCapacityProvider', {
            capacityProviderName: capacityProviderName,
            autoScalingGroup: this.asg,
            enableManagedScaling: false,
            enableManagedTerminationProtection: false,
        });

        this.cluster.addAsgCapacityProvider(capacityProvider);

        /**
         * Create warm pool if warmPoolMinSize is set.
         */
        if (warmPoolMinSize) {
            this.asg.addUserData("echo ECS_WARM_POOLS_CHECK=true >> /etc/ecs/ecs.config");

            new WarmPool(this, "AutoScalingWarmPool", {
                asg: this.asg,
                appPrefix: appPrefix,
                warmPoolMinSize: warmPoolMinSize,
                stage: stage
            })
        }

        const launchConfig = this.asg.node.tryFindChild("LaunchConfig") as autoscaling.CfnLaunchConfiguration
        launchConfig.metadataOptions = {
            httpTokens: "required",
            httpEndpoint: "enabled",
        }
        this.asg.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

        const instanceNameTag = 'Name';
        const singlePassHostclassTag = 'singlepass-ec2-client-hostclass';

        //as per https://w.amazon.com/bin/view/SPIE/Onboarding/CDK/
        // Attach tags for SPIE, https://w.amazon.com/index.php/SPIE/Onboarding#Part_2:_Set_Up_Your_EC2_Instances
        const asgTagProps: cdk.TagProps = {
            applyToLaunchedInstances: true,
            includeResourceTypes: ['AWS::AutoScaling::AutoScalingGroup'],
        };
        this.asg.node.applyAspect(new cdk.Tag(singlePassHostclassTag, "AWS-GURU-DETECTOR", asgTagProps));
        this.asg.node.applyAspect(new cdk.Tag('PvreReporting', '1', asgTagProps));

        // Add policy for SPIE, https://w.amazon.com/index.php/SPIE/Onboarding#Step_2:_Create_IAM_Policy_for_EC2_Instances
        this.asg.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['ec2:DescribeTags'],
            resources: ['*'],
        }));
        this.asg.addToRolePolicy(new iam.PolicyStatement({
            effect: iam.Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: [`arn:aws:iam::${this.env.account}:role/singlepass-sync-reader`],
        }));

        installChronicleForASG(this, this.asg, this.chronicleAgentScript, this.singlePassBootstrapScript);
    }

    // Remove AWSGuru or AWSGuruDetector prefix from appPrefix
    private stripAppPrefix(appPrefix: string): string {
        return appPrefix.replace(/^(AWS)/i, '');
    }
}
