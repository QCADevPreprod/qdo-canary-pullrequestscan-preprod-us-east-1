import iam = require("monocdk/aws-iam");
import {SAGEMAKER_ACCOUNTS} from "../../constants/accounts";
import {Policy} from "monocdk/aws-iam";
import {DeploymentStack} from "@amzn/pipelines";

/**
 * Creates policy for the SageMaker invoker role.
 * @param deploymentStack
 * @param region
 * @param stage
 */
export const assumeSagemakerInvokeRolePolicy = (
    deploymentStack: DeploymentStack,
    region: string,
    stage: string,
) => {
    const modelAccountId = SAGEMAKER_ACCOUNTS[stage][region];
    return new Policy(deploymentStack, 'assumeSagemakerInvokeRolePolicy', {
        statements: [
            new iam.PolicyStatement({
                effect: iam.Effect.ALLOW,
                actions: ['sts:AssumeRole'],
                resources: [
                    `arn:aws:iam::${modelAccountId}:role/SagemakerInvokeRole`
                ]
            })
        ]
    });
};
