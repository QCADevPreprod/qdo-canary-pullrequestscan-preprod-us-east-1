import * as rip from '@amzn/rip-helper';

/**
 * Helper function to get CloudFormation endpoint.
 *
 * Output for commercial region and gov regions:
 * - https://cloudformation.<region>.amazonaws.com
 *
 * @param region, e.g., us-west-2.
 */
export function getCloudFormationEndpoint(region: string): string {
    return `https://cloudformation.${region}.${rip.getRegion(region).domain}`;
}
