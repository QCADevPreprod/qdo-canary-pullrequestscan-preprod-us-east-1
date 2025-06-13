import '@monocdk-experiment/assert/jest';

import core = require('monocdk');
import s3 = require('monocdk/aws-s3');
import {env, stage, region, createCacheTable, prefix} from './test_env';
import {EcsTaskStack} from '../lib/ecs_task';

const app = new core.App();
const appProdArtifact = new core.App();
const appProd = new core.App();
const appGamma = new core.App();
describe('ecs task stack', () => {
    test('creates ecs task stack', () => {
        const ecsTask = new EcsTaskStack(app, 'ecsTask', {
            env: env,
            stage: stage,
            region: env.region,
            recommendationBucketKeyAlias: 's3/InferRecommendationBucketKey',
            recommendationLogBucket: 'infer-recommendation-accesslog',
            recommendationBucket: 'infer-recommendation',
            createCacheTable: createCacheTable,
            prefix: prefix
        });
        expect(ecsTask).toHaveResource("AWS::KMS::Key", {
            "EnableKeyRotation": true
        });
        expect(ecsTask).toHaveResource('AWS::S3::Bucket', {
            "BucketName": 'infer-recommendation-accesslog-beta-us-west-2',
            "AccessControl": s3.BucketAccessControl.LOG_DELIVERY_WRITE
        });
        expect(ecsTask).toHaveResource('AWS::S3::Bucket', {
            "BucketName": 'infer-recommendation-beta-us-west-2'
        });
        expect(ecsTask).toHaveResource('AWS::S3::BucketPolicy');
        expect(ecsTask.recommendationBucket.encryptionKey?.keyArn.toString())
            .toEqual(ecsTask.recommendationKmsKey.keyArn.toString());
        expect(ecsTask).toHaveResource("AWS::IAM::Policy");
    });
});