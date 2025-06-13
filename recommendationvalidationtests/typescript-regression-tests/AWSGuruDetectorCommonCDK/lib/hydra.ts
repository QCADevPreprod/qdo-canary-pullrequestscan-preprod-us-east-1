import cdk = require('monocdk');
import iam = require('monocdk/aws-iam');
import s3 = require("monocdk/aws-s3");
import kms = require("monocdk/aws-kms");
import { HydraSeries, HydraTestRunResources } from "@amzn/hydra";
import {
    BrazilPackage,
    DeploymentEnvironment,
    DeploymentStack,
    DeploymentStackProps,
    HydraComputeEngine,
    HydraTestApprovalWorkflowStep,
    HydraTestApprovalWorkflowStepPlatforms
} from "@amzn/pipelines";
import { ArnPrincipal, Effect, PolicyStatement, ServicePrincipal } from "monocdk/aws-iam";
import { DETECTOR_HOSTING_ACCOUNTS } from './constants/accounts';
import { EXTERNAL_SERVICE_PRINCIPAL, INTERNAL_SERVICE_PRINCIPAL } from "./constants/facts";
import { PROD_STAGE } from "./constants/stages";

export interface HydraStackProps extends DeploymentStackProps {
    readonly stage: string;
    readonly region: string;
    readonly resourceName: string;
    readonly packageNames: string[];
    readonly targetBrazilPackageName: string;
    readonly disambiguator: string;
    readonly testDataBucketKeyAlias: string;
    readonly testDataBucket: string;
    readonly testType: string;
    readonly launchType: string;
    readonly skipBucketCreation? : boolean;
}

export class HydraStack extends DeploymentStack {

    public readonly hydraResources: HydraTestRunResources;
    public readonly hydraApprovalWorkflow: HydraTestApprovalWorkflowStep;
    public readonly testDataBucket: s3.Bucket;
    public readonly testDataBucketKmsKey: kms.Key;
    public readonly testDataBucketPolicy: s3.BucketPolicy;
    public readonly testType: string;
    public readonly launchType: string;
    public hydraLoadTestApprovalWorkflow: HydraTestApprovalWorkflowStep;
    public canary: HydraSeries;
    private runDefinitionIntegTests:{};

    constructor(parent: cdk.App, name: string, props: HydraStackProps) {
        super(parent, name, props);

        this.testType = props.testType;
        this.launchType = props.launchType;
        this.runDefinitionIntegTests = {
            SchemaVersion: "1.0",
            SchemaType: "HydraJavaTestNG",
            HydraParameters: {
                ComputeEngine: "Fargate",
                FullyQualifiedPackageName: props.packageNames
            },
            HandlerParameters: {
                parameters: {
                    domain: props.stage,
                    region: props.region,
                    testType : props.testType,
                    launchType : props.launchType,
                    detectorHostingAccountId: DETECTOR_HOSTING_ACCOUNTS[props.stage][props.region]
                }
            }
        };

        this.hydraResources = new HydraTestRunResources(this, `${props.resourceName}`, {
            hydraEnvironment: props.env.hydraEnvironment,
            targetPackage: BrazilPackage.fromString(props.targetBrazilPackageName),
            hydraAssetProps: {
                engine: HydraComputeEngine.FARGATE
            },
            disambiguator: props.disambiguator
        });

        this.grantHydraInvocationRolePermissions(this.hydraResources.invocationRole, props.stage, props.region);

        // hydra integration test
        this.hydraApprovalWorkflow = this.hydraResources.createApprovalWorkflowStep({
            name: `ECS Task Integration Tests ${props.stage}-${props.region}`,
            runDefinition: this.runDefinitionIntegTests,
            versionSetPlatform: HydraTestApprovalWorkflowStepPlatforms.AL2_X86_64
        })

        if (! props.skipBucketCreation) {

            //Create KMS key
            this.testDataBucketKmsKey = new kms.Key(this, 'TestDataBucketKey', {
                alias: props.testDataBucketKeyAlias,
                description: 'Used for encryption/decryption of test bucket',
                enableKeyRotation: true
            });

            this.testDataBucket = new s3.Bucket(this, `${props.testDataBucket}-${props.stage}-${props.region}`, {
                encryptionKey: this.testDataBucketKmsKey,
                bucketName: `${props.testDataBucket}-${props.stage}-${props.region}`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                lifecycleRules: [{
                    expiration: cdk.Duration.days(3)
                }],
                versioned: true
            });

            this.testDataBucketPolicy = new s3.BucketPolicy(this, 'TestDataBucketPolicy', {
                bucket: this.testDataBucket
            });

            this.testDataBucketPolicy.document.addStatements(
                new PolicyStatement({
                    actions: ['s3:*'],
                    principals: [new iam.AnyPrincipal()],
                    resources: [this.testDataBucket.arnForObjects('*')],
                    conditions: {Bool: {'aws:SecureTransport': false}},
                    effect: Effect.DENY
                }));

            this.testDataBucketPolicy.document.addStatements(
                // grant root and Admin permission
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:ListBucket'],
                    resources: [
                        this.testDataBucket.bucketArn,
                        `${this.testDataBucket.bucketArn}/*`
                    ],
                    principals: [
                        new ArnPrincipal(`arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:root`),
                        new ArnPrincipal(`arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/Admin`),
                    ]
                }));

            let servicePrincipal = props.stage == PROD_STAGE ? EXTERNAL_SERVICE_PRINCIPAL : INTERNAL_SERVICE_PRINCIPAL;
            this.testDataBucketPolicy.document.addStatements(
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:ListBucket'],
                    resources: [this.testDataBucket.bucketArn, `${this.testDataBucket.bucketArn}/*`],
                    principals: [new ServicePrincipal(servicePrincipal)]
                })
            );
            this.testDataBucketKmsKey.addToResourcePolicy(new PolicyStatement({
                actions: ["kms:Decrypt"],
                resources: ["*"],
                principals: [new ServicePrincipal(servicePrincipal)]
            }));

        }
    }

   public setupGenerateRecommendationTests(stage: string, region: string, env: DeploymentEnvironment,
        resourceName: string): HydraTestApprovalWorkflowStep {
        const runDefinitionIntegTests = {
                SchemaVersion: "1.0",
                SchemaType: "HydraJavaTestNG",
                HydraParameters: {
                    ComputeEngine: "Lambda",
                    Metrics: {
                        Enabled: true
                    },
                    FullyQualifiedPackageName: ["com.amazonaws.guru.detector.hosting.tests.happy",
                                                "com.amazonaws.guru.detector.hosting.tests.sad"]
                },
                HandlerParameters: {
                    parameters: {
                        domain: stage,
                        region: region,
                        stepfunctionName: 'DetectorHostingIV'
                    }
                }
            };
        const hydraTestRunResources = new HydraTestRunResources(this, `${resourceName}`, {
            hydraEnvironment: env.hydraEnvironment,
            targetPackage: BrazilPackage.fromString('AWSGuruDetectorHostingTests'),
            hydraAssetProps: {
                engine: HydraComputeEngine.LAMBDA
            },
            disambiguator: "DetectorHosting"
        });

        this.grantHydraInvocationRolePermissions(hydraTestRunResources.invocationRole, stage, region);


        // hydra integration test
        const sfnIntegTestApprovalWorkflow = hydraTestRunResources.createApprovalWorkflowStep({
            name: `DetectorHosting Integration Tests ${stage}-${region}`,
            runDefinition: runDefinitionIntegTests,
            versionSetPlatform: HydraTestApprovalWorkflowStepPlatforms.AL2_X86_64
        });
        return sfnIntegTestApprovalWorkflow;
    }

    public createCanary(stage: string, region: string, packageName: string,
            packages: string[], rate : string, instanceCount: number): any {
        const canaryRunDef = {
          "SchemaVersion": "1.0",
          "SchemaType": "HydraJavaTestNG",
          "HydraParameters": {
            "Runtime": "java8",
            "ComputeEngine": "Fargate",
            "TestVertical": "CANARY",
            "TestPackageName": packageName,
            "FullyQualifiedPackageName": packages,
            "Series": [{
              "Rate": rate,
              "ConcurrentInstanceCount": instanceCount
            }],
            "Metrics": {
              "Enabled": true
            }
          },
          "HandlerParameters": {
              "parameters": {
                  "domain": stage,
                  "region": region,
                  "testType" : this.testType,
                  "launchType" : this.launchType
              }
          },
          "EnvironmentVariables": {
            "Stage": stage
          }
        };
        this.canary =  HydraSeries.fromAsset(this, 'FargateCanary', {
            hydraSettings: this.hydraResources,
            targetPackage: this.hydraResources.targetPackage,
            runDefinition: canaryRunDef,
            engine: HydraComputeEngine.FARGATE
        });
    };

    public createLoadTestApproval(stage: string, region: string, packageName: string,
                 packages: string[], rate : string, duration : string, instanceCount: number): any {
        const loadTestDef = {
          "SchemaVersion": "1.0",
          "SchemaType": "HydraJavaTestNG",
          "HydraParameters": {
            "Runtime": "java8",
            "ComputeEngine": "Fargate",
            "TestVertical": "LOADTEST",
            "TestPackageName": packageName,
            "FullyQualifiedPackageName": packages,
            "Series": [{
              "Rate": rate,
              "Duration": duration,
              "ConcurrentInstanceCount": instanceCount,
              "ApprovalHeuristics": [{
                "Name": "global_completion_rate",
                "Threshold": "75.0"
              },{
                 "Name": "fail_global_error_rate",
                 "Threshold": "25.0"
              }]
            }],
            "Metrics": {
              "Enabled": true
            }
          },
          "HandlerParameters": {
              "parameters": {
                  "domain": stage,
                  "region": region,
                  "testType": this.testType,
                  "launchType" : this.launchType
              }
          },
          "EnvironmentVariables": {
            "Stage": stage
          }
        };
        this.hydraLoadTestApprovalWorkflow = this.hydraResources.createApprovalWorkflowStep({
                name: `ECS Task Load Tests ${stage}-${region}`,
                runDefinition: loadTestDef,
                versionSetPlatform: HydraTestApprovalWorkflowStepPlatforms.AL2012
        })
        return this.hydraLoadTestApprovalWorkflow;
    };

    private grantHydraInvocationRolePermissions(invocationRole: iam.Role, stage: string, region: string) {
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['kms:GenerateDataKey', 'kms:Encrypt', 'kms:Decrypt', 'kms:DescribeKey'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['s3:GetObject', 's3:PutObject', 's3:ListBucket'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['ec2:DescribeSubnets', 'ec2:describeSecurityGroups'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['ecs:RunTask', 'ecs:DescribeTasks'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['iam:PassRole'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['sqs:SendMessage', 'kms:DescribeKey', 'kms:Decrypt', 'kms:ReEncrypt', 'kms:GenerateDataKey'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['execute-api:Invoke'],
                resources: ['*']
            })
        );
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['sts:AssumeRole'],
                resources: [`arn:aws:iam::${DETECTOR_HOSTING_ACCOUNTS[stage][region]}:role/DetectorIntegTestSfnRole`]
            })
        );
        // Premission needed for Caching - list task definitions is to generate cache key, Get/Delete is
        // to make sure detector is actually storing recommendations to DDB
        invocationRole.addToPolicy(
            new PolicyStatement({
                effect: Effect.ALLOW,
                actions: ['ecs:ListTaskDefinitions', 'dynamodb:GetItem', 'dynamodb:DeleteItem', 'dynamodb:Query'],
                resources: ['*']
            })
        );
    }
}