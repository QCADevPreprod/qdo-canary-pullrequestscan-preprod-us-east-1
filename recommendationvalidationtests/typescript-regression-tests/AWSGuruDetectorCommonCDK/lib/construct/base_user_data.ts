import * as ec2 from 'monocdk/aws-ec2';
import {Stack} from 'monocdk';
import {AutoScalingGroup, CfnAutoScalingGroup} from 'monocdk/aws-autoscaling';
import {getCloudFormationEndpoint} from "../util";
import dedent = require('dedent-js');

export interface BaseUserDataProps {
    /**
     * Auto-scaling group.
     */
    readonly autoScalingGroup: AutoScalingGroup;
    /**
     * Instance launch lifecycle hook name
     */
    readonly launchLifecycleHookName?: string;
    /**
     * AWS CLI max attempts allowed
     *
     * When we have auto-scaling event starting significant amount of instances, we might be throttled. Increase the
     * max attempts allows more retries.
     *
     * @default 10
     */
    readonly awsCliMaxAttempts?: number;
}

/**
 * Example usage:
 * const userData = new GuruUserData(guruUserDataProps)
 *      .addCommands('custom command 1 || error_exit')
 *      .installAndUpdateAwsCli()
 *      .addCommands('custom command 2 || error_exit')
 *      .render();
 */
export class BaseUserData {
    instanceIdVar: string;
    asgNameVar: string;
    readonly region: string;
    readonly stackName: string;
    readonly roleName: string;
    readonly autoScalingGroupLogicalId: string;
    readonly rawUserData: ec2.UserData;
    readonly props: BaseUserDataProps;

    public constructor(props: BaseUserDataProps) {
        this.region = props.autoScalingGroup.env.region;
        this.stackName = Stack.of(props.autoScalingGroup).stackName;
        this.roleName = props.autoScalingGroup.role.roleName;
        this.autoScalingGroupLogicalId = Stack.of(props.autoScalingGroup).getLogicalId(
            props.autoScalingGroup.node.defaultChild as CfnAutoScalingGroup,
        );
        this.props = props;
        this.rawUserData = ec2.UserData.forLinux();

        // Add max attempts
        this.rawUserData.addCommands(`export AWS_MAX_ATTEMPTS=${props.awsCliMaxAttempts ?? 10}`);
        this.rawUserData.addCommands(`export AWS_RETRY_MODE_DEFAULT="adaptive"`);
    }

    /**
     * Export AutoScalingGroup name to variable `ASG_NAME`
     */
    public exportAutoScalingGroupName(): BaseUserData {
        this.rawUserData.addCommands(dedent`
            export ASG_NAME=$(aws autoscaling describe-auto-scaling-instances --region ${this.region} --instance-ids "$${this.instanceIdVar}" | jq -r '.AutoScalingInstances[0].AutoScalingGroupName')
        `);
        this.asgNameVar = 'ASG_NAME';
        return this;
    }

    /**
     * Export instance ID to variable `INSTANCE_ID`
     */
    public exportInstanceId(): BaseUserData {
        this.rawUserData.addCommands(dedent`
            token=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
            export INSTANCE_ID=$(curl -H "X-aws-ec2-metadata-token: $token" --silent --show-error --retry 3 http://169.254.169.254/latest/meta-data/instance-id);
        `);
        this.instanceIdVar = 'INSTANCE_ID';
        return this;
    }

    /**
     * Life cycle hooks aren't created before asg is created. This will result in a failure when the stack is created for
     * the very first time. We only attempt to complete lifecycle hook if it actually exists.
     * @param actionResult
     */
    public completeLifecycleActionCommand(actionResult: 'CONTINUE' | 'ABANDON'): string {
        return dedent`
        echo "Start completeLifecycleActionCommand at $(date)"
        is_lifecyclehook_created=$(aws autoscaling describe-lifecycle-hooks --region ${this.region} --auto-scaling-group-name $${this.asgNameVar} --query 'LifecycleHooks[].LifecycleHookName | contains(@, \`${this.props.launchLifecycleHookName}\`)');
        echo "is_lifecyclehook_created: $is_lifecyclehook_created"
        if [ "$is_lifecyclehook_created" == true ]
        then
            # Notify EC2 Autoscaling that the instance is ready to go.
            echo "complete-lifecycle-action with: ${actionResult} started"
                aws autoscaling complete-lifecycle-action \
                --lifecycle-action-result ${actionResult} \
                --instance-id $${this.instanceIdVar} \
                --lifecycle-hook-name "${this.props.launchLifecycleHookName}" \
                --auto-scaling-group-name $${this.asgNameVar} \
                --region ${this.region}
            echo "complete-lifecycle-action with: ${actionResult} ended"
        fi
        `;
    }

    public addExitOnError(): BaseUserData {
        this.rawUserData.addCommands(dedent`
          error_exit() {
              echo Error: $1
              ${this.props.launchLifecycleHookName ? this.completeLifecycleActionCommand('ABANDON') : ''}
              ${this.runCfnSignalCommand(1, '$1')}
              exit 1
          }
          trap 'error_exit' ERR;
      `);
        return this;
    }

    public installAndUpdateAwsCli(): BaseUserData {
        this.rawUserData.addCommands(dedent`
            yum install -y aws-cli || error_exit 'Failed to install aws-cli'
            yum update -y aws-cli || error_exit 'Failed to update aws-cli'
        `);
        return this;
    }

    public installAndUpdateJq(): BaseUserData {
        this.rawUserData.addCommands(dedent`
              yum install -y jq || error_exit 'Failed to install jq'
              yum update -y jq || error_exit 'Failed to update jq'
        `);
        return this;
    }

    public installAndUpdateAwsCfnBootstrap(): BaseUserData {
        this.rawUserData.addCommands(dedent`
            yum install -y aws-cfn-bootstrap || error_exit 'Failed to install aws-cfn-bootstrap'
            yum update -y aws-cfn-bootstrap || error_exit 'Failed to update aws-cfn-bootstrap'
        `);
        return this;
    }

    public runCfnSignal(): BaseUserData {
        this.rawUserData.addCommands(this.runCfnSignalCommand(0, 'Instance is up!'), `echo 'Done'`);
        return this;
    }

    /**
     * Add your custom commands here.
     * Custom commands can be interwoven with other commands, for example:
     * new GuruUserData(guruUserDataProps)
     *      .addCommands('custom command 1 || error_exit') // 'error_exit' has already been declared in the constructor.
     *      .startService()
     *      .addCommands('custom command 2)
     *      .render()
     */
    public addCommands(...commands: string[]): BaseUserData {
        this.rawUserData.addCommands(...commands);
        return this;
    }

    public render(): string {
        // Print user data log to system log
        this.rawUserData.addCommands(`cat /var/log/userdata.log >&2`);
        this.rawUserData.addCommands('exit 0'); // Exit to avoid unwanted CDK added user data to be executed
        return this.rawUserData.render();
    }

    public runCfnSignalCommand(exitCode: number, reason: string) {
        return `/opt/aws/bin/cfn-signal --exit-code ${exitCode} --reason '${reason}' \
        --stack ${this.stackName} --role ${this.roleName} --url ${getCloudFormationEndpoint(this.region)} \
        --resource ${this.autoScalingGroupLogicalId} --region ${this.region}`;
    }
}

