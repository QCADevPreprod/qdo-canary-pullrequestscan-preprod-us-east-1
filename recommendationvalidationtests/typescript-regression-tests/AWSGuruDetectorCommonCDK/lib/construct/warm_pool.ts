import {Construct} from "monocdk";
import autoscaling = require('monocdk/aws-autoscaling');
import {GuruUserDataScriptProvider} from "./user_data_provider";
import {Effect, Policy, PolicyStatement} from "monocdk/aws-iam";
import {PREPROD_STAGE} from "../constants/stages";

export interface WarmPoolProps {
    /**
     * The ASG to add the warm pool to.
     */
    readonly asg: autoscaling.AutoScalingGroup;
    /**
     * The minimum capacity of the warm pool.
     */
    readonly warmPoolMinSize: number;
    /**
     * The unique identifier for the application.
     */
    readonly appPrefix: string;
    /**
     * The environment stage.
     */
    readonly stage: string;
}

/**
 * Class to define construct for WarmPool.
 */
export class WarmPool extends Construct {

    constructor(scope: Construct, id: string, props: WarmPoolProps) {
        super(scope, id);

        new autoscaling.WarmPool(this, 'DefaultAutoScalingGroupWarmPool', {
            autoScalingGroup: props.asg,
            minSize: props.warmPoolMinSize,
            poolState: autoscaling.PoolState.STOPPED,
            // ECS doesn't allow reusing instance on scale-in.
            // https://tiny.amazon.com/15oufyukb/docsawsamazAmazlatedeveasgc
            reuseOnScaleIn: false,
        });

        this.pullDockerImage(props);
    }

    /**
     * Pull docker image from ECR during warm pool initialization.
     */
    private pullDockerImage(props: WarmPoolProps): void {
        const ec2LifecycleHookInstanceStartName = 'EC2LifecycleHookInstanceStart';
        const lifeCycleHook = new autoscaling.CfnLifecycleHook(this, 'EC2LifecycleHookInstanceStart', {
            autoScalingGroupName: props.asg.autoScalingGroupName,
            lifecycleTransition: autoscaling.LifecycleTransition.INSTANCE_LAUNCHING,
            heartbeatTimeout: 300,
            lifecycleHookName: ec2LifecycleHookInstanceStartName,
        });

        // Guru userdata
        const userDataScript = new GuruUserDataScriptProvider({
            autoScalingGroup: props.asg,
            lifeCycleHookName: ec2LifecycleHookInstanceStartName,
            isWarmPoolEnabled: true,
            appPrefix: props.appPrefix,
        });

        props.asg.addUserData(userDataScript.getUserData());

        /**
         * Attach policies to role to allow docker image pull.
         */
        props.asg.role.attachInlinePolicy(this.getEcsPolicy());
        props.asg.role.attachInlinePolicy(this.getEcrPolicy());
        props.asg.role.attachInlinePolicy(this.getCloudformationPolicy());
        props.asg.role.attachInlinePolicy(this.getAutoScalingPolicy());
    }

    private getAutoScalingPolicy(): Policy {
        return new Policy(this, 'AutoscalingPolicy', {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        'autoscaling:DescribeAutoScalingInstances',
                        'autoscaling:DescribeLifecycleHooks',
                        'autoscaling:CompleteLifecycleAction'
                    ],
                    resources: ['*']
                })
            ]
        });
    }

    private getCloudformationPolicy(): Policy {
        return new Policy(this, 'CloudformationPolicy', {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        'cloudformation:SignalResource',
                        'cloudformation:DescribeStackResource'
                    ],
                    resources: ['*']
                })
            ]
        });
    }

    private getEcsPolicy(): Policy {
        return new Policy(this, 'ECSPolicy', {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        'ecs:DescribeTaskDefinition',
                        'ecs:ListTaskDefinitions'
                    ],
                    resources: ['*'],
                })
            ]
        });
    }

    private getEcrPolicy(): Policy {
        return new Policy(this, 'ECRPolicy', {
            statements: [
                new PolicyStatement({
                    effect: Effect.ALLOW,
                    actions: [
                        'ecr:GetAuthorizationToken',
                        'ecr:BatchCheckLayerAvailability',
                        'ecr:BatchGetImage',
                        'ecr:GetDownloadUrlForLayer'
                    ],
                    resources: ['*'],
                })
            ]
        });
    }
}
