import '@monocdk-experiment/assert/jest';

import core = require('monocdk');
import { env } from './test_env';
import {Vpc} from '../lib/vpc';
import {EcsClusterStack} from '../lib/ecs_cluster';

const app = new core.App();

describe('ecs cluster stack', () => {
    test('creates an ecs cluster', () => {
        const { vpc } = new Vpc(app, 'VPC', {
            vpcName: 'DragonGlassVpc',
            vpcLogGroupName: '/vpc/dragonglass-vpc-logs',
            securityGroupName:  'DG-PrivateLink-SG',
            noOutboundSecurityGroupName: 'DG-NoOutbound-SG',
            env: env,
            stage : 'beta'});

        const stack = new EcsClusterStack(app, 'EcsCluster', {
           clusterName: 'EcsCluster',
           env: env,
           vpc: vpc });

        expect(stack).toHaveResource('AWS::ECS::Cluster');
    });
});