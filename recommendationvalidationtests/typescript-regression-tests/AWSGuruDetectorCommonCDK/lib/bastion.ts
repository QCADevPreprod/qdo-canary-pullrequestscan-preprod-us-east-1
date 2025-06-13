import cdk = require('monocdk');
import { DeploymentStack, DeploymentStackProps } from "@amzn/pipelines";
import { SinglePass, EcsBastion } from "@amzn/singlepass";
import { Cluster, EcsOptimizedImage } from 'monocdk/aws-ecs';
import { Effect, ManagedPolicy, PolicyStatement, Role } from 'monocdk/aws-iam';
import {
    Vpc, SecurityGroup, Port, Protocol,
    GenericLinuxImage,
    InstanceClass,
    InstanceSize,
    InstanceType,
    SubnetType, Peer,
    CloudFormationInit
} from 'monocdk/aws-ec2';
import { AutoScalingGroup, ScalingProcess, Signals, UpdatePolicy } from 'monocdk/aws-autoscaling';
import {
  AmiProvider,
  BonesAmiProvider,
  BonesAmiTemplateType,
  BonesRepoGuidProvider,
  CloudFormationInitWithPatchOnBoot,
  PatchOnBootPatchBaseline,
  RepoGuidProvider,
  SupportedOsType,
  PVREReporter
} from '@amzn/instance-replacement-patching-cdkconstructs';
import { runPathRecipeSync } from '@amzn/brazil'
import { cfnInitConfigSetProps } from "./chronicle";
import fs = require("fs");

const instanceNameTag = 'Name';
const singlePassHostclassTag = 'singlepass-ec2-client-hostclass';
const bastionInstanceType = InstanceType.of(InstanceClass.BURSTABLE2, InstanceSize.MICRO);

// Allow ssh access Corp: https://apll.corp.amazon.com/?region=us-west-2.
const PREFIX_LISTS: {[key: string]: string} = {
    'us-east-1': 'pl-60b85b09',
    'us-west-2': 'pl-f8a64391',
    'eu-west-1': 'pl-01a74268',
    'ap-northeast-1': 'pl-bea742d7',
    'eu-north-1': 'pl-a5ac49cc',
    'us-east-2': 'pl-e5a5408c',
    'eu-central-1': 'pl-1ea54077',
    'eu-west-2': 'pl-51a04538',
    'ap-southeast-1': 'pl-1ca54075',
    'ap-southeast-2': 'pl-1aa54073'
};

export function getPrefixList(region: string) {
    const prefixList = PREFIX_LISTS[region];
    if (!prefixList) {
        throw new Error(`Prefix list not found for region '${region}'`);
    }
    return prefixList;
}

export class BastionStack extends DeploymentStack {

    readonly securityGroup : SecurityGroup;
    readonly autoScalingGroup : AutoScalingGroup;

    constructor(scope: cdk.Construct, id: string, props: DeploymentStackProps) {
        super(scope, id, props);

        const vpc = new Vpc(this, "Vpc", {
            cidr: '10.0.0.0/16' // IP address space for private internets
        });

        //as per https://w.amazon.com/bin/view/SPIE/Onboarding/CDK/
        const spie = new SinglePass(this, 'SinglePass', {});

        this.securityGroup = new SecurityGroup(this, 'BastionSecurityGroup', {
            securityGroupName: 'BastionSecurityGroup',
            vpc: vpc,
            allowAllOutbound: true
        });

        this.securityGroup.addIngressRule(Peer.ipv4(vpc.vpcCidrBlock), Port.allTcp(), 'IPv4 TCP Access from local VPC');
        this.securityGroup.addIngressRule(Peer.prefixList(getPrefixList(props.env.region)), Port.tcp(22), 'SSH Access from Corp Network');

        let pvreReporter = new PVREReporter(this, 'pvre-reporter');
        let osType: SupportedOsType = SupportedOsType.AmazonLinux2_x86_64;
        let amiProvider: AmiProvider = new BonesAmiProvider(BonesAmiTemplateType.fromSupportedOSType(osType));
        let repoGuidProvider: RepoGuidProvider = new BonesRepoGuidProvider();
        let patchBaseline = new PatchOnBootPatchBaseline(this, `PatchBaseline-${osType.nameForPatchBaseline}`, {
          osType, repoGuidProvider,
        });

        var instanceType = bastionInstanceType;
        if (props.env.region == 'eu-north-1') {
            //https://sage.amazon.com/posts/668477
            //ARN does not have t2 instances
            instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MEDIUM);
        }

        this.autoScalingGroup = new AutoScalingGroup(this, 'BastionHostASG', {
            vpc: vpc,
            instanceType: instanceType,
            associatePublicIpAddress: true,
            vpcSubnets: {
                subnetType: SubnetType.PUBLIC,
            },
            minCapacity: 1,
            maxCapacity: 1,
            requireImdsv2: true,
            machineImage: amiProvider.getRegionalMachineImage(),
            signals: Signals.waitForAll({
                minSuccessPercentage: 0, //set to 0 for now to ensure the bastion comes up in all stages
                timeout: cdk.Duration.minutes(30),
            }),
            updatePolicy: UpdatePolicy.rollingUpdate({
                maxBatchSize: 1,
                suspendProcesses: [
                    ScalingProcess.HEALTH_CHECK,
                    ScalingProcess.REPLACE_UNHEALTHY,
                    ScalingProcess.AZ_REBALANCE,
                    ScalingProcess.ALARM_NOTIFICATION,
                ],
            }),
        });
        
        const cloudFormationInit: CloudFormationInit = CloudFormationInitWithPatchOnBoot.fromBonesPatchingWithRegion(osType, 
            props.env.region, cfnInitConfigSetProps(), this.autoScalingGroup.role.roleName);
        this.autoScalingGroup.applyCloudFormationInit(cloudFormationInit)
        
        patchBaseline.attachPermissionsToRole(this.autoScalingGroup.role);

        this.autoScalingGroup.role.addManagedPolicy(ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

        this.autoScalingGroup.addSecurityGroup(this.securityGroup);

        // Attach tags for SPIE, https://w.amazon.com/index.php/SPIE/Onboarding#Part_2:_Set_Up_Your_EC2_Instances
        const asgTagProps: cdk.TagProps = {
            applyToLaunchedInstances: true,
            includeResourceTypes: ['AWS::AutoScaling::AutoScalingGroup'],
        };
        this.autoScalingGroup.node.applyAspect(new cdk.Tag(singlePassHostclassTag, "AWS-GURU-DETECTOR", asgTagProps));
        this.autoScalingGroup.node.applyAspect(new cdk.Tag(instanceNameTag, 'Bastion-EC2', asgTagProps));
        this.autoScalingGroup.node.applyAspect(new cdk.Tag('PvreReporting', '1', asgTagProps));

        // Add policy for SPIE, https://w.amazon.com/index.php/SPIE/Onboarding#Step_2:_Create_IAM_Policy_for_EC2_Instances
        this.autoScalingGroup.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['ec2:DescribeTags'],
            resources: ['*'],
        }));
        this.autoScalingGroup.addToRolePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: [spie.syncReaderRole.roleArn],
        }));
    }

    private getNebulaAmiMap(region: string): { [region: string]: string } {

        const bastionAMITemplatePath
            = runPathRecipeSync('[BONESIsengardAMITemplateAmazonLinux2]pkg.runtimefarm');
        const bastionAMITemplate
            = JSON.parse(fs.readFileSync(`${bastionAMITemplatePath}/cloudFormation/generatedIsengardAMI.template.yml`,
            { encoding: 'utf-8' }));

        return {[region]: bastionAMITemplate.Mappings.RegionMap[region].execution};
    }
}