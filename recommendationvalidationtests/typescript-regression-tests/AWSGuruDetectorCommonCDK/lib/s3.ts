import iam = require("monocdk/aws-iam");
import { DeploymentStack, DeploymentEnvironment, DogmaTagsOptions, SoftwareType } from "@amzn/pipelines";
import { App, Aws, Duration } from "monocdk";
import { BlockPublicAccess, Bucket, BucketAccessControl, BucketEncryption, BucketPolicy } from "monocdk/aws-s3";
import { Key } from "monocdk/aws-kms";
import { AccountPrincipal, AnyPrincipal, ArnPrincipal, Effect, PolicyStatement, ServicePrincipal } from "monocdk/aws-iam";
import { DETECTOR_HOSTING_ACCOUNTS } from "./constants/accounts";
import { developerUsername, PROD_STAGE } from "./constants/stages";
import { EXTERNAL_SERVICE_PRINCIPAL, INTERNAL_SERVICE_PRINCIPAL } from "./constants/facts";

export interface S3StackProps {
    readonly stage: string;
    readonly region: string;
    readonly env: DeploymentEnvironment;
    readonly stackName?: string;
    readonly isDev?: boolean;
    readonly detectorFullName: string;
    readonly detectorShortName: string;
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

export class S3Stack extends DeploymentStack {
    readonly recommendationLogBucket: Bucket;
    readonly recommendationBucket: Bucket;
    readonly recommendationKmsKey: Key;
    readonly bucketPolicy: BucketPolicy;

    constructor(parent: App, name: string, props: S3StackProps) {
        super(parent, name, {
            softwareType: SoftwareType.INFRASTRUCTURE,
            ...props
        });

        // Create KMS key
        this.recommendationKmsKey = new Key(this, 'recommendationBucketKey', {
            alias: `s3/${props.detectorFullName}RecommendationBucketKey`,
            description: `Used for encryption/decryption of ${props.detectorFullName} recommendation bucket`,
            enableKeyRotation: true
        });

        // Grant detector hosting account access to decrypt recommendations
        this.recommendationKmsKey.addToResourcePolicy(new PolicyStatement({
            actions: ['kms:Decrypt'],
            resources: ['*'],
            principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.region])]
        }));

        const shortNameLowercase = props.detectorShortName.toLowerCase();
        // use shortened detector name to avoid going over bucket name max length
        this.recommendationLogBucket = new Bucket(this, `${shortNameLowercase}-recommendation-accesslog-${props.stage}-${props.region}`, {
            encryption: BucketEncryption.KMS_MANAGED,
            bucketName: props.isDev ? `${developerUsername}-${shortNameLowercase}-recommendation-accesslog-${props.stage}-${props.region}`
                : `${shortNameLowercase}-recommendation-accesslog-${props.stage}-${props.region}`,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            versioned: true
        });

        const fullNameLowercase = props.detectorFullName.toLowerCase();
        // Create bucket to store recommendations
        this.recommendationBucket = new Bucket(this, `${fullNameLowercase}-recommendation-${props.stage}-${props.region}`, {
            encryptionKey: this.recommendationKmsKey,
            bucketName: props.isDev ? `${developerUsername}-${fullNameLowercase}-recommendation-${props.stage}-${props.region}`
                : `${fullNameLowercase}-recommendation-${props.stage}-${props.region}`,
            blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
            serverAccessLogsBucket: this.recommendationLogBucket,
            serverAccessLogsPrefix: `${shortNameLowercase}-recommendation-accesslog-`,
            lifecycleRules: [{
                enabled: true,
                id: 'RecommendationExpiryRule',
                expiration: Duration.days(10)
            }],
            versioned: true
        });

        // Enforce HTTPS
        this.recommendationLogBucket.addToResourcePolicy(new PolicyStatement({
            effect: Effect.DENY,
            principals: [new AnyPrincipal()],
            actions: ['s3:*'],
            resources: [this.recommendationLogBucket.arnForObjects('*')],
            conditions: {Bool: {'aws:SecureTransport': false}}
        }));

        // Providing PutObject permissions to logging.s3.amazon.com
        // https://docs.aws.amazon.com/AmazonS3/latest/userguide/enable-server-access-logging.html
        this.recommendationLogBucket.addToResourcePolicy(new PolicyStatement({
            principals: [new ServicePrincipal("logging.s3.amazonaws.com")],
            effect: Effect.ALLOW,
            actions: ["s3:PutObject"],
            resources: [this.recommendationLogBucket.arnForObjects("*")],
        }));

        this.bucketPolicy = new BucketPolicy(this, 'RecommendationBucketPolicy', {
            bucket: this.recommendationBucket
        });

        const servicePrincipal = props.stage == PROD_STAGE ? EXTERNAL_SERVICE_PRINCIPAL : INTERNAL_SERVICE_PRINCIPAL;

        this.bucketPolicy.document.addStatements(
            // Enforce HTTPS
            new PolicyStatement({
                effect: Effect.DENY,
                principals: [new AnyPrincipal()],
                actions: ['s3:*'],
                resources: [this.recommendationBucket.arnForObjects('*')],
                conditions: {Bool: {'aws:SecureTransport': false}}
            }),
            // Grant root and admin permission
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [
                    new ArnPrincipal(`arn:${Aws.PARTITION}:iam::${Aws.ACCOUNT_ID}:root`),
                    new ArnPrincipal(`arn:${Aws.PARTITION}:iam::${Aws.ACCOUNT_ID}:role/Admin`),
                ],
                actions: ['s3:GetObject', 's3:ListBucket'],
                resources: [
                    this.recommendationBucket.bucketArn,
                    `${this.recommendationBucket.bucketArn}/*`
                ]
            }),
            // Enforce SSE-KMS
            new PolicyStatement({
                effect: Effect.DENY,
                principals: [new AnyPrincipal()],
                actions: ['s3:PutObject'],
                resources: [this.recommendationBucket.arnForObjects('*')],
                conditions: {'StringNotEquals': {'s3:x-amz-server-side-encryption': 'aws:kms'}}
            }),
            new PolicyStatement({
                effect: Effect.DENY,
                principals: [new AnyPrincipal()],
                actions: ['s3:PutObject'],
                resources: [this.recommendationBucket.arnForObjects('*')],
                conditions: {'Null': {'s3:x-amz-server-side-encryption': 'true'}}
            }),
            // Grant Guru service principal permission to fetch from recommendation bucket
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new ServicePrincipal(`${servicePrincipal}`)],
                actions: ['s3:GetObject', 's3:ListBucket'],
                resources: [this.recommendationBucket.bucketArn, `${this.recommendationBucket.bucketArn}/*`]
            }),
            // Allow detector hosting account to fetch recommendations from s3 bucket
            new PolicyStatement({
                effect: Effect.ALLOW,
                principals: [new AccountPrincipal(DETECTOR_HOSTING_ACCOUNTS[props.stage][props.region])],
                actions: ['s3:GetObject'],
                resources: [this.recommendationBucket.bucketArn, `${this.recommendationBucket.bucketArn}/*`]
            })
        );

        // Grant Guru service principal permission to decrypt recommendations
        this.recommendationKmsKey.addToResourcePolicy(
            new PolicyStatement({
                principals: [new ServicePrincipal(`${servicePrincipal}`)],
                actions: ['kms:Decrypt'],
                resources: ['*']
            }),
        );
    }
}
