import cdk = require('monocdk');
import s3 = require("monocdk/aws-s3");
import kms = require("monocdk/aws-kms");
import iam = require("monocdk/aws-iam");
import {DeploymentEnvironment, DeploymentStack, DogmaTagsOptions, SoftwareType} from '@amzn/pipelines';
import {
    AccountPrincipal,
    ArnPrincipal,
    Effect,
    PolicyDocument,
    PolicyStatement,
    Role,
    ServicePrincipal
} from 'monocdk/aws-iam';
import {DETECTOR_HOSTING_ACCOUNTS} from "./constants/accounts";
import {developerUsername, PROD_STAGE} from "./constants/stages";
import {EXTERNAL_SERVICE_PRINCIPAL, INTERNAL_SERVICE_PRINCIPAL} from "./constants/facts";
import {runPathRecipeSync} from '@amzn/brazil';
import {AttributeType, BillingMode, Table, TableEncryption} from "monocdk/aws-dynamodb";
import {IKey, Key} from "monocdk/aws-kms";

export interface EcsTaskStackProps {

    readonly stage: string;
    readonly region: string;
    readonly env: DeploymentEnvironment;
    readonly stackName?: string;
    readonly isDev?: boolean;
    readonly skipBucketCreation?: boolean;
    readonly recommendationBucketKeyAlias: string;
    readonly recommendationLogBucket: string;
    readonly recommendationBucket: string;
    readonly thirdPartyPackageConfigBucket?: string;
    readonly createCacheTable?: boolean;
    readonly prefix?: string;
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

/**
 * Ths class defines a stack that creates aws resources for ECS Detector Tasks.
 */
export class EcsTaskStack extends DeploymentStack {
    readonly recommendationLogBucket: s3.Bucket;
    readonly recommendationBucket: s3.Bucket;
    readonly thirdPartyPackageConfigBucket: s3.Bucket;
    readonly thirdPartyAccessLogBucket: s3.Bucket;
    readonly recommendationKmsKey: kms.Key;
    readonly bucketPolicy: s3.BucketPolicy;
    readonly codeArtifactCachingDDB: Table;
    readonly createCacheTable: boolean;
    readonly prefix: string;

    constructor(parent: cdk.App, name: string, props: EcsTaskStackProps) {
        super(parent, name, {
            dogmaTags: props.dogmaTags,
            env: props.env,
            softwareType: SoftwareType.LONG_RUNNING_SERVICE,
            stackName: props.stackName,
            tags: props.tags,
        });

        //Create KMS key
        this.recommendationKmsKey = new kms.Key(this, `recommendationBucketKey`, {
            alias: props.recommendationBucketKeyAlias,
            description: 'Used for encryption/decryption of recommendation bucket',
            enableKeyRotation: true
        });

        // grant detector hosting account access to decrypt recommendations
        this.recommendationKmsKey.addToResourcePolicy(new PolicyStatement({
            actions: ["kms:Decrypt"],
            resources: ["*"],
            principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.region])]
        }));
        if (! props.skipBucketCreation) {
            this.recommendationLogBucket = new s3.Bucket(this, `${props.recommendationLogBucket}-${props.stage}-${props.region}`, {
                encryption: s3.BucketEncryption.S3_MANAGED,
                bucketName: props.isDev ? `${developerUsername}-${props.recommendationLogBucket}-${props.stage}-${props.region}`
                    : `${props.recommendationLogBucket}-${props.stage}-${props.region}`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                // TO_DO: the objectOwnership configuration need to remove after we migrate to CDK 2.0
                // When we use the monocdk to create the recommendationBucket by providing the serverAccessLogsBucket
                // and serverAccessLogsPrefix, it will automatically configure the recommendationLogBucket
                // accessControl as LogDeliveryWrite, which use the canned acls instead of bucket policy.
                // In monocdk, there's no way to disable the logBucket accessControl, hence we need enable the ACLs by
                // setting the objectOwnerShip as ObjectWriter.
                // Ref: https://quip-amazon.com/2bDrAFBAZgTb/S3-default-setting-guidance#temp:C:ECZ00ba9b1ee0b24bf28daa14860
                objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
                versioned: true
            });

            this.recommendationBucket = new s3.Bucket(this, `${props.recommendationBucket}-${props.stage}-${props.region}`, {
                encryptionKey: this.recommendationKmsKey,
                bucketName: props.isDev ? `${developerUsername}-${props.recommendationBucket}-${props.stage}-${props.region}`
                    : `${props.recommendationBucket}-${props.stage}-${props.region}`,
                blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                serverAccessLogsBucket: this.recommendationLogBucket,
                serverAccessLogsPrefix: '${props.recommendationLogBucket}-',
                lifecycleRules: [{
                    expiration: cdk.Duration.days(3)
                }],
                versioned: true
            });

            this.recommendationLogBucket.addToResourcePolicy(new PolicyStatement({
                actions: ['s3:*'],
                principals: [new iam.AnyPrincipal()],
                resources: [this.recommendationLogBucket.arnForObjects('*')],
                conditions: {Bool: {'aws:SecureTransport': false}},
                effect: Effect.DENY
            }));

            // Providing PutObject permissions to logging.s3.amazon.com
            // https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
            this.recommendationLogBucket.addToResourcePolicy(new PolicyStatement({
                principals: [new ServicePrincipal("logging.s3.amazonaws.com")],
                effect: Effect.ALLOW,
                actions: ["s3:PutObject"],
                resources: [this.recommendationLogBucket.arnForObjects("*")],
            }));

            this.bucketPolicy = new s3.BucketPolicy(this, 'props.recommendationBucketPolicy', {
                bucket: this.recommendationBucket
            });
            this.bucketPolicy.document.addStatements(
                new PolicyStatement({
                    actions: ['s3:*'],
                    principals: [new iam.AnyPrincipal()],
                    resources: [this.recommendationBucket.arnForObjects('*')],
                    conditions: {Bool: {'aws:SecureTransport': false}},
                    effect: Effect.DENY
                }));
            this.bucketPolicy.document.addStatements(
                // grant root and Admin permission
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:ListBucket'],
                    resources: [
                        this.recommendationBucket.bucketArn,
                        `${this.recommendationBucket.bucketArn}/*`
                    ],
                    principals: [
                        new ArnPrincipal(`arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:root`),
                        new ArnPrincipal(`arn:${cdk.Aws.PARTITION}:iam::${cdk.Aws.ACCOUNT_ID}:role/Admin`),
                    ]
                }));

            if (props.recommendationBucket === 'inputvalidation-recommendation') {

                const accessCodeArtifactMetadataRole =
                    this.createRoleToAccessCodeArtifactMetadata(props, this.recommendationBucket.bucketName)

                this.bucketPolicy.document.addStatements(
                    // grant AccessCodeArtifactMetadataRole GetObject permission
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: ['s3:GetObject'],
                        resources: [
                            `arn:aws:s3:::${this.recommendationBucket.bucketName}/*/CodeArtifactMetadata.zip`
                        ],
                        principals: [
                            new ArnPrincipal(accessCodeArtifactMetadataRole.roleArn)
                        ]
                    })
                );
            }

            this.bucketPolicy.document.addStatements(
                new PolicyStatement({
                    effect:Effect.DENY,
                    actions:['s3:PutObject'],
                    principals: [new iam.AnyPrincipal()],
                    resources: [this.recommendationBucket.arnForObjects('*')],
                    conditions: {
                        'StringNotEquals': {
                            "s3:x-amz-server-side-encryption-aws-kms-key-id": this.recommendationKmsKey.keyArn
                        }
                    }
                })
            );

            this.bucketPolicy.document.addStatements(
                new PolicyStatement({
                    effect:Effect.DENY,
                    actions:['s3:PutObject'],
                    principals: [new iam.AnyPrincipal()],
                    resources: [this.recommendationBucket.arnForObjects('*')],
                    conditions: {
                        'Bool': {'s3:x-amz-server-side-encryption': true}
                    }
                })
            );

            this.addPrincipalToBucketPolicy(props.stage, this.recommendationBucket.bucketArn);
            if (props.stage != PROD_STAGE) {
                this.recommendationKmsKey.addToResourcePolicy(new PolicyStatement({
                    actions: ["kms:Decrypt"],
                    resources: ["*"],
                    principals: [new ServicePrincipal(INTERNAL_SERVICE_PRINCIPAL)]
                }));
            } else {
                this.recommendationKmsKey.addToResourcePolicy(new PolicyStatement({
                    actions: ["kms:Decrypt"],
                    resources: ["*"],
                    principals: [new ServicePrincipal(EXTERNAL_SERVICE_PRINCIPAL)]
                }));
            }
            // Grant detector hosting account permission to get recommendations from s3 bucket
            this.bucketPolicy.document.addStatements(
              new PolicyStatement({
                  effect: Effect.ALLOW,
                  actions: ['s3:GetObject'],
                  resources: [this.recommendationBucket.bucketArn, `${this.recommendationBucket.bucketArn}/*`],
                  principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.region])]
              }));

            if (props.thirdPartyPackageConfigBucket) {
                this.thirdPartyAccessLogBucket = new s3.Bucket(this, `${props.thirdPartyPackageConfigBucket}-${props.stage}-${props.region}`, {
                    encryption: s3.BucketEncryption.KMS_MANAGED,
                    bucketName: `${props.thirdPartyPackageConfigBucket}-acclog-${props.stage}-${props.region}`,
                    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                    objectOwnership: s3.ObjectOwnership.OBJECT_WRITER,
                    versioned: true
                });

                this.thirdPartyPackageConfigBucket = new s3.Bucket(this, `${props.thirdPartyPackageConfigBucket}--${props.stage}-${props.region}`, {
                    bucketName: `${props.thirdPartyPackageConfigBucket}-${props.stage}-${props.region}`,
                    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
                    serverAccessLogsBucket: this.thirdPartyAccessLogBucket,
                    serverAccessLogsPrefix: `${props.thirdPartyPackageConfigBucket}-acclog-`,
                    versioned: true
                });
                // Providing PutObject permissions to logging.s3.amazon.com
                // https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
                this.thirdPartyAccessLogBucket.addToResourcePolicy(new PolicyStatement({
                    principals: [new ServicePrincipal("logging.s3.amazonaws.com")],
                    effect: Effect.ALLOW,
                    actions: ["s3:PutObject"],
                    resources: [this.thirdPartyAccessLogBucket.arnForObjects("*")],
                }));

                //this.addPrincipalToBucketPolicy(props.stage, this.thirdPartyPackageConfigBucket.bucketArn);
                const thirdPartyPackageConfig = runPathRecipeSync('[AWSGuruThirdPartyPackageConfig]pkg.runtimefarm')
                const configurationFolder = `${thirdPartyPackageConfig}/AWSGuruThirdPartyPackageConfig/lib/configuration`;
                new cdk.aws_s3_deployment.BucketDeployment(this, `ThirdPartyPackageConfig-${props.stage}-${props.region}`, {
                    sources: [cdk.aws_s3_deployment.Source.asset(`${configurationFolder}/third_party_pkgs_config/s3`)],
                    destinationBucket: this.thirdPartyPackageConfigBucket,
                    destinationKeyPrefix: "resources/third_party_pkgs_config",
                });
            }
        }

        this.createCacheTable = props.createCacheTable ? props.createCacheTable : false;
        this.prefix = props.prefix ? props.prefix : "";
        if (this.createCacheTable) {
            // create a DDB table for CodeArtifact caching
            this.codeArtifactCachingDDB = this.createCodeArtifactCachingDDB(props);
        }
    }

    public addPrincipalToBucketPolicy (stage: string, bucketArn: string) {
        if (stage != PROD_STAGE) {
            this.bucketPolicy.document.addStatements(
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:ListBucket'],
                    resources: [`${bucketArn}`, `${bucketArn}/*`],
                    principals: [new ServicePrincipal(INTERNAL_SERVICE_PRINCIPAL)]
                })
            );
        } else {
            this.bucketPolicy.document.addStatements(
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ['s3:GetObject', 's3:ListBucket'],
                    resources: [`${bucketArn}`, `${bucketArn}/*`],
                    principals: [new ServicePrincipal(EXTERNAL_SERVICE_PRINCIPAL)]
                })
            );
        }
    }

    private createCodeArtifactCachingDDB(props: EcsTaskStackProps) {
        const { stage, region } = props
        const tableName = `${this.prefix}CodeArtifactCachingTable`
        const encryptionKey = this.createTableCmk(tableName);
        const codeArtifactCachingTable = new Table(this, tableName, {
            tableName: tableName,
            billingMode: BillingMode.PAY_PER_REQUEST,
            partitionKey: {
                name: "codeArtifactHashKey",
                type: AttributeType.STRING
            },
            encryption: TableEncryption.CUSTOMER_MANAGED,
            encryptionKey: encryptionKey,
            timeToLiveAttribute: 'expirationTime',
            pointInTimeRecovery: true,
            removalPolicy: cdk.RemovalPolicy.RETAIN,
        });
        return codeArtifactCachingTable;
    }

    private createTableCmk(tableName: string): IKey {
        return new Key(this, `${tableName}DynamoDBKMSKey`, {
            enableKeyRotation: true,
            policy: this.buildTableCmkPolicyDocument(),
            alias: tableName,
        });
    }

    /*
    * DDB Policy for KMS - https://docs.aws.amazon.com/kms/latest/developerguide/services-dynamodb.html
    */
    private buildTableCmkPolicyDocument(): PolicyDocument {
        const accountId = this.account;
        return new PolicyDocument({
            statements: [
                new PolicyStatement({
                    sid:
                        'Allow access through Amazon DynamoDB for all principals in the account that are authorized to use Amazon DynamoDB',
                    principals: [new iam.AnyPrincipal()],
                    resources: ['*'],
                    conditions: {
                        StringEquals: {
                            'kms:CallerAccount': accountId,
                        },
                        StringLike: {
                            'kms:ViaService': 'dynamodb.*.amazonaws.com',
                        },
                    },
                    actions: [
                        'kms:Encrypt',
                        'kms:Decrypt',
                        'kms:ReEncrypt*',
                        'kms:GenerateDataKey*',
                        'kms:CreateGrant',
                        'kms:DescribeKey',
                    ],
                    effect: Effect.ALLOW,
                }),
                new PolicyStatement({
                    sid: 'Allow direct access to key metadata to the account',
                    principals: [new AccountPrincipal(accountId)],
                    resources: ['*'],
                    actions: ['kms:*'],
                    effect: Effect.ALLOW,
                }),
                new PolicyStatement({
                    sid:
                        'Allow DynamoDB Service with service principal name dynamodb.amazonaws.com to describe the key directly',
                    principals: [new ServicePrincipal('dynamodb.amazonaws.com')],
                    resources: ['*'],
                    actions: ['kms:Describe*', 'kms:Get*', 'kms:List*'],
                    effect: Effect.ALLOW,
                }),
            ],
        });
    }

    /**
     * Create role to allow {@link AWSGuruCodeArtifactFetcher} to download code artifact metadata.
     *
     * More details:- https://t.corp.amazon.com/V818556134/overview
     */
    private createRoleToAccessCodeArtifactMetadata(props: EcsTaskStackProps, bucketName: string): Role {

        const servicePrincipal: string = props.stage === PROD_STAGE
            ? 'codeguru-reviewer.amazonaws.com'
            : 'guru.aws.internal';

        const permissionToAccessCodeArtifactObjects = new PolicyDocument({
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        "s3:ListBucket",
                        "s3:GetObject"
                    ],
                    resources: [
                        `arn:aws:s3:::${bucketName}`,
                        `arn:aws:s3:::${bucketName}/*/CodeArtifactMetadata.zip`
                    ]
                }),
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: ["kms:Decrypt"],
                    resources: ["*"]
                })
            ]
        });

        return new Role(this, "AccessCodeArtifactMetadataRole", {
            roleName: "AccessCodeArtifactMetadataRole",
            assumedBy: new ServicePrincipal(servicePrincipal),
            inlinePolicies: {
                permissionToAccessCodeArtifactObjects
            }
        });
    }
}
