import {
    BrazilContainerImage,
    BrazilPackage,
    BrazilPackageLambdaCode,
    DeploymentEnvironment,
    DeploymentStack,
    DogmaTagsOptions,
    SoftwareType
} from "@amzn/pipelines";
import { Construct, Duration } from "monocdk";
import { QueueProcessingEc2Service } from "monocdk/aws-ecs-patterns";
import { Rule, Schedule } from 'monocdk/aws-events';
import { LambdaFunction } from 'monocdk/aws-events-targets';
import {
    AccountPrincipal,
    AccountRootPrincipal,
    ArnPrincipal,
    Effect,
    ManagedPolicy,
    PolicyDocument,
    PolicyStatement,
    Role,
    ServicePrincipal
} from "monocdk/aws-iam";
import { Key } from 'monocdk/aws-kms';
import { LogGroup, RetentionDays } from "monocdk/aws-logs";
import { Queue, QueueEncryption } from "monocdk/aws-sqs";
import { DETECTOR_HOSTING_ACCOUNTS } from "./constants/accounts";
import { MAX_TASKS_PER_HOST } from './constants/autoscalingThresholds';
import {
    getLambdaInsightsLayerArn
} from "./constants/lambdaLayer";
import {
    PREPROD_STAGE, PROD_ARTIFACT_BUILDER_STAGE,
    PROD_REGRESSION_STAGE, PROD_STAGE
} from "./constants/stages";
import { SQS_RECEIVE_MESSAGE_WAIT_TIME_SECONDS, SQS_RETENTION_SECONDS, SQS_VISIBILITY_TIMEOUT_SECONDS } from './constants/timeouts';
import { EcsClusterStack } from "./ecs_cluster";
import { assumeSagemakerInvokeRolePolicy } from './roles/policy/assumeSagemakerInvokeRolePolicy';
import cdk = require('monocdk');
import ecs = require('monocdk/aws-ecs');
import lambda = require('monocdk/aws-lambda');
import ec2 = require('monocdk/aws-ec2');

export interface EcsServiceStackProps {
    readonly vpc: ec2.IVpc;
    readonly ecsClusterStack: EcsClusterStack;
    readonly appPrefix: string;
    readonly stage: string;
    readonly env: DeploymentEnvironment;
    readonly stackName?: string;
    readonly memoryLimitMiB: number;
    readonly instanceType: string;
    readonly minCapacity: number;
    readonly maxCapacity: number;
    readonly warmPoolMinSize?: number;
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
    readonly addPrefix?: boolean;
    readonly enableCloudCover?: boolean;
}

export function overrideStage(stage : string): string {
    if ((stage == PREPROD_STAGE) || (stage == PROD_ARTIFACT_BUILDER_STAGE)
     || (stage == PROD_REGRESSION_STAGE)) {
       return PROD_STAGE;
    } else {
       return stage;
    }
}

export function getKMSKey(context: Construct, keyId: string): Key {
    const kmsEncryptionKey = new Key(context, keyId, {
        alias: `alias/${keyId}`,
        description: `Used to encrypt/decrypt the Detector account SQS contents`,
        enableKeyRotation: true,
    });

    kmsEncryptionKey.addToResourcePolicy(
        new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ["kms:*"],
            resources: ["*"],
            principals: [new AccountRootPrincipal(), new ServicePrincipal('sqs.amazonaws.com')],
        })
    );

    return kmsEncryptionKey;
}

export class CodeGuruQueueProcessingEc2Service extends QueueProcessingEc2Service {
    configureAutoscalingForService(service : ecs.Ec2Service) {
    }
}

export class EcsServiceStack extends DeploymentStack {

    private taskInputQueue: Queue;
    private taskOutputQueue: Queue;
    private ecsClusterStack: EcsClusterStack;
    private detectorTaskLauncherLambda: lambda.Function;

    constructor(parent: cdk.App, name: string, props: EcsServiceStackProps) {
        super(parent, name, {
            softwareType: SoftwareType.INFRASTRUCTURE,
            dogmaTags: props.dogmaTags,
            env: props.env,
            stackName: props.stackName,
            tags: props.tags,
        });

        const jvmMemoryAllocationPercentage = props.appPrefix === "AWSGuruDetectorInconsistency" ? 0.25 : 0.85;

        const ecsServiceEnv: { [key: string]: string } = {};
        ecsServiceEnv['AWS_REGION'] = props.env.region;
        ecsServiceEnv['STAGE'] = overrideStage(props.stage);
        ecsServiceEnv['Region'] = props.env.region;
        ecsServiceEnv['OVERRIDE_STAGE'] = props.stage;
        ecsServiceEnv['JVM_MAX_MEMORY'] = Math.floor(props.memoryLimitMiB * jvmMemoryAllocationPercentage).toString();
        if (props.enableCloudCover) {
            ecsServiceEnv['JAVA_TOOL_OPTIONS'] = "-javaagent:/opt/amazon/lib/jacocoagent.jar=output=none,dumponexit=false";
        }

        const SCRATCH_VOLUME_NAME = "scratch"
        const MU_CONTEXT_VOLUME_NAME = "MU_CONTEXT"

        let inputQueue : string = 'TaskInputQueue';
        if (props.addPrefix) {
           inputQueue = `${props.appPrefix}TaskInputQueue`;
        }

        const kmsKey = getKMSKey(this, `${inputQueue}-EncryptionKey`);

        this.taskInputQueue = new Queue(this, inputQueue, {
            queueName: inputQueue,
            receiveMessageWaitTime: Duration.seconds(SQS_RECEIVE_MESSAGE_WAIT_TIME_SECONDS.get(props.stage)!),
            visibilityTimeout: Duration.seconds(SQS_VISIBILITY_TIMEOUT_SECONDS.get(props.stage)!),
            retentionPeriod: Duration.seconds(SQS_RETENTION_SECONDS.get(props.stage)!),
            encryption: QueueEncryption.KMS,
            encryptionMasterKey: kmsKey
        });

        this.taskInputQueue.addToResourcePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: [this.taskInputQueue.queueArn],
            principals: [
                new ArnPrincipal(`arn:aws:iam::${props.env.account}:root`)
            ],
            actions: ["SQS:ReceiveMessage", "SQS:DeleteMessage"],
        }));
        this.taskInputQueue.addToResourcePolicy(new PolicyStatement({
            actions: ["SQS:SendMessage"],
            resources: [this.taskInputQueue.queueArn],
            principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.env.region])]
        }));
        this.taskInputQueue.encryptionMasterKey?.addToResourcePolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ["*"],
            principals: [
                new ArnPrincipal(`arn:aws:iam::${props.env.account}:root`)
            ],
            actions: ["kms:Decrypt"],
        }));
        this.taskInputQueue.encryptionMasterKey?.addToResourcePolicy(new PolicyStatement({
            actions: ["kms:DescribeKey", "kms:Decrypt", "kms:ReEncrypt", "kms:GenerateDataKey"],
            resources: ["*"],
            principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.env.region])]
        }));

        this.ecsClusterStack = props.ecsClusterStack;

        // Set up log group and stream
        let serviceLogGroup = new LogGroup(this, `${props.appPrefix}ServiceLogGroup`,
            {
                logGroupName: `/ecs/${props.appPrefix}-service-logs`,
                retention: RetentionDays.INFINITE
            });
        const serviceLogDriver = new ecs.AwsLogDriver({
            streamPrefix: 'detector-service',
            logGroup: serviceLogGroup
        });

        const queueProcessingEc2Service = new CodeGuruQueueProcessingEc2Service(this, 'Service', {
            cluster: this.ecsClusterStack.cluster,
            image: new BrazilContainerImage({
                brazilPackage: BrazilPackage.fromString(`${props.appPrefix}`),
                transformPackage: BrazilPackage.fromString(`${props.appPrefix}ImageBuild`),
                componentName: 'task',
            }),
            environment: ecsServiceEnv,
            enableLogging: true,
            logDriver: serviceLogDriver,
            queue: this.taskInputQueue,
            containerName: `${props.appPrefix}Container`,
            memoryLimitMiB: props.memoryLimitMiB,
            desiredTaskCount: 0,
            minScalingCapacity: 0,
            maxScalingCapacity: props.maxCapacity * MAX_TASKS_PER_HOST
        });

        queueProcessingEc2Service.taskDefinition.addVolume(
            {
                name: SCRATCH_VOLUME_NAME,
                dockerVolumeConfiguration: {
                    scope: ecs.Scope.TASK,
                    driver: 'local',
                    driverOpts: {'type': 'tmpfs', 'device': 'tmpfs'}
                }
            });

        queueProcessingEc2Service.taskDefinition.addVolume(
            {
                name: MU_CONTEXT_VOLUME_NAME,
                dockerVolumeConfiguration: {
                    scope: ecs.Scope.TASK,
                    driver: 'local',
                    driverOpts: {'type': 'tmpfs', 'device': 'tmpfs'}
                }
            });

        queueProcessingEc2Service.taskDefinition.defaultContainer?.addMountPoints(
            {
                sourceVolume: SCRATCH_VOLUME_NAME,
                containerPath: "/tmp",
                readOnly: false
            },
            {
                sourceVolume: MU_CONTEXT_VOLUME_NAME,
                containerPath: "/opt/amazon/mu-context",
                readOnly: false
            }
        );

        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            resources: ["*"],
            actions: ["cloudwatch:PutMetricData"],
        }));

        queueProcessingEc2Service.taskDefinition.taskRole
            .attachInlinePolicy(assumeSagemakerInvokeRolePolicy(this, props.env.region, props.stage));

        // Grant task role s3 permissions to get objects for fetching code artifacts
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: ['*'],
            actions: [
                's3:GetObject',
                's3:ListBucket',
                's3:PutObject'
            ]
        }));
        // Grant task role kms permission to decrypt code artifacts
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: ['*'], // using * as we don't know the resource that we are decrypting
            actions: [
                "kms:Decrypt",
                "kms:Encrypt",
                "kms:GenerateDataKey"
            ]
        }));

        // Grant task role permission to consume from the taskInputQueue
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: [this.taskInputQueue.queueArn],
            actions: [
                "SQS:ReceiveMessage", "SQS:DeleteMessage"
            ]
        }));
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: ["*"],
            actions: [
                "kms:Decrypt"
            ]
        }));

        // Grant task role permission to use DynamoDB
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: ["*"],
            actions: [
                "dynamodb:GetItem", "dynamodb:PutItem", "dynamodb:UpdateItem", "dynamodb:Query"
            ]
        }));

        // Grant task role task definition permissions
        queueProcessingEc2Service.taskDefinition.taskRole.addToPrincipalPolicy(new PolicyStatement({
            resources: ["*"],
            actions: [
                "ecs:ListTaskDefinitions"
            ]
        }));

        const hostingAccount = DETECTOR_HOSTING_ACCOUNTS[props.stage][props.env.region];
        const detectorHostingSfnRoleArn = `arn:aws:iam::${hostingAccount}:role/DetectorHostingSfnRole`;
        // Grant task role permission to assume the role that execute the Step Function in the Hosting account
        queueProcessingEc2Service.taskDefinition.taskRole.addToPolicy(new PolicyStatement({
            resources: [detectorHostingSfnRoleArn],
            actions: [
                "sts:AssumeRole"
            ]
        }));

        const cloudwatchRole = new Role(this, `${props.appPrefix}CloudwatchRole`, {
            roleName: `${props.appPrefix}CloudwatchRole`,
            assumedBy: new ArnPrincipal(`arn:aws:iam::${hostingAccount}:root`)
        })
        cloudwatchRole.addToPolicy(new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['cloudwatch:describeAlarms'],
            resources: ["*"]
        }));

        this.ecsClusterStack.addEc2Capacity(props.vpc, props.instanceType, props.minCapacity,
            props.maxCapacity, props.stage, props.appPrefix, props.warmPoolMinSize);

        this.ecsClusterStack.addSqsAutoScalingPolicy(inputQueue)

        const taskLauncherLambdaPolicy = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        'ecs:listTaskDefinitions',
                        'ecs:listServices',
                        'ecs:describeServices',
                        'ecs:updateService',
                        'ecs:runTask'
                    ],
                    resources: ['*']
                }),
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['iam:PassRole'],
                    resources: ['*']
                })
            ]
        });
        const taskLauncherLambdaExecutionRole = new Role(this, `${props.appPrefix}TaskLauncherRole`, {
                assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
                roleName: `${props.appPrefix}TaskLauncherRole`,
                managedPolicies: [
                    ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
                    ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
                ],
                inlinePolicies: {
                    TaskLauncherLambdaAdditionalPolicy: taskLauncherLambdaPolicy
                }
            }
        );

        const lambdaInsightsLayer = lambda.LayerVersion.fromLayerVersionArn(this, `LambdaInsightsLayerFromArn`,
            getLambdaInsightsLayerArn(props.env.region));

        this.detectorTaskLauncherLambda = new lambda.Function(this, `${props.appPrefix}TaskLauncherLambda`, {
            functionName: `${props.appPrefix}TaskLauncherLambda`,
            role: taskLauncherLambdaExecutionRole,
            layers: [lambdaInsightsLayer],
            code: new BrazilPackageLambdaCode({
                brazilPackage: BrazilPackage.fromString('AWSGuruDetectorTaskLauncherLambda-1.0'),
                componentName: 'TaskLauncher',
            }),
            handler: 'com.amazonaws.guru.detector.tasklauncher.TaskLauncher::handleRequest',
            memorySize: 1024,
            timeout: cdk.Duration.minutes(2),
            runtime: lambda.Runtime.JAVA_8_CORRETTO,
            environment: {
                "Region": props.env.region,
                "Stage": props.stage,
                "Account": props.env.account,
                "ApplicationName": props.appPrefix,
            }
        });

        const rule = new Rule(this, `${props.appPrefix}TaskLauncherRule`, {
          schedule: Schedule.expression('rate(1 minute)')
        });
        rule.addTarget(new LambdaFunction(this.detectorTaskLauncherLambda));
    }
}
