import '@monocdk-experiment/assert/jest';

import core = require('monocdk');
import { env } from './test_env';
import {Vpc} from '../lib/vpc';

const app = new core.App();

describe('vpc stack tests', () => {
    test('creates a vpc', () => {
        const stack = new Vpc(app, 'VPC', {
            vpcName: 'DragonGlassVpc',
            vpcLogGroupName: '/vpc/dragonglass-vpc-logs',
            securityGroupName:  'DG-PrivateLink-SG',
            noOutboundSecurityGroupName: 'DG-NoOutbound-SG',
            env: env,
            stage : 'beta'
        });
        expect(stack).toHaveResource('AWS::EC2::VPC');
        expect(stack).toHaveOutput({
            exportName: 'DragonGlassVpc'
        });
        const vpc = stack.vpc;

        // validate only isolated subnets are created for this vpc
        expect(vpc.publicSubnets.length).toEqual(0);
        expect(vpc.privateSubnets.length).toEqual(0);
        expect(vpc.isolatedSubnets).not.toBeNull();
        expect(vpc.isolatedSubnets.length).toEqual(3);

        // validate no outbound traffic security group
        const noOutboundSecurityGroup = stack.noOutboundSecurityGroup;
        expect(noOutboundSecurityGroup).toBeDefined();
        expect(noOutboundSecurityGroup.securityGroupVpcId.toString).toEqual(vpc.vpcId.toString);
        expect(noOutboundSecurityGroup.allowAllOutbound).toBeFalsy();
        expect(noOutboundSecurityGroup.connections).toBeDefined();
    });
});