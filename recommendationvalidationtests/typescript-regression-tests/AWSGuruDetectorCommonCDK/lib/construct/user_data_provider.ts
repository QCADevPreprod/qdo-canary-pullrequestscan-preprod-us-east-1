import dedent = require("dedent-js");
import {UserData} from "monocdk/aws-ec2"
import {BaseUserData} from "./base_user_data";
import {AutoScalingGroup} from "monocdk/aws-autoscaling";

/**
 * User data script properties.
 */
export interface GuruUserDataProviderProps {
    /**
     * AutoScalingGroup
     */
    readonly autoScalingGroup: AutoScalingGroup;
    /**
     * Instance launch lifecycle hook name.
     */
    readonly lifeCycleHookName: string;
    /**
     * Is warm pool enabled?
     */
    readonly isWarmPoolEnabled: boolean;
    /**
     * Application prefix.
     */
    readonly appPrefix: string;
}

/**
 * A class should implement this interface if its purpose is to provide a custom userdata script
 * for ecs launch configuration.
 */
export interface IUserDataScriptProvider {
    /**
     * This method should return userdata.
     * More details on UserData: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-launchconfig.html
     */
    getUserData(): string
}

export interface IUserDataScriptInitializer {
    /**
     * This method should return userdata.
     */
    getUserData(): UserData;
}

export class GuruUserDataScriptProvider implements IUserDataScriptProvider {
    private readonly guruUserData: BaseUserData;
    private readonly userDataProviderProps: GuruUserDataProviderProps;

    constructor(props: GuruUserDataProviderProps) {
        this.userDataProviderProps = props;

        this.guruUserData = new BaseUserData({
            autoScalingGroup: props.autoScalingGroup,
            launchLifecycleHookName: props.lifeCycleHookName
        }).installAndUpdateAwsCli()
            .installAndUpdateJq()
            .installAndUpdateAwsCfnBootstrap()
            .exportInstanceId()
            .exportAutoScalingGroupName()
            .addExitOnError();

        this.guruUserData
            .addCommands(dedent`
              function launch_into_warm_pool {
                  # Setting any failure to invoke error_exit method & send notification to cfn
                  trap 'error_exit' ERR;
                  echo "Calling launch_into_warm_pool $(date)"
                  ${this.get_pulling_docker_images_command(this.userDataProviderProps.appPrefix)}
                  ${this.guruUserData.completeLifecycleActionCommand('CONTINUE')}
                  ${this.guruUserData.runCfnSignalCommand(0, 'Warm pool is good to go!')}
              }
          `)
            .addCommands(dedent`
              function launch_from_warm_pool_to_service {
                  # Setting any failure to invoke error_exit method & send notification to cfn
                  trap 'error_exit' ERR;
                  echo "Calling launch_from_warm_pool_to_service $(date)"
                  ${this.guruUserData.completeLifecycleActionCommand('CONTINUE')}
                  ${this.guruUserData.runCfnSignalCommand(0, 'Instance is ready to be launched!')}
              }
          `)
            .addCommands(dedent`
              function launch_instance {
                  # Setting any failure to invoke error_exit method & send notification to cfn
                  trap 'error_exit' ERR;
                  echo "Calling launch_instance $(date)"
                  TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
                  target_state=$(curl --silent --show-error --retry 3 -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/autoscaling/target-lifecycle-state)
                  echo "target_state: $target_state  $(date)"
                  # If an instance is entering warmpool, the target_state is Warmed:Stopped
                  # https://docs.aws.amazon.com/autoscaling/ec2/userguide/warm-pool-instance-lifecycle.html
              
                  if [ "$target_state" = "Warmed:Stopped" ]
                    then
                      launch_into_warm_pool
                    else
                      launch_from_warm_pool_to_service
                  fi
              }
            `)
            .addCommands(dedent`
              launch_instance > /var/log/userdata.log 2>&1 &
          `);
    }

    public getUserData(): string {
        return this.guruUserData.render();
    }

    private get_pulling_docker_images_command(appPrefix: string) {
        const region = this.userDataProviderProps.autoScalingGroup.env.region;
        const account = this.userDataProviderProps.autoScalingGroup.env.account;
        return dedent`
              echo "Fetch taskDefinition for the ${appPrefix}"
              taskdefinition=$(aws ecs list-task-definitions --region ${region} --sort DESC | jq '.taskDefinitionArns' | jq --raw-output 'map(select(test("${appPrefix}EcsService")))' | jq --raw-output '.[0]')  
              echo "Task definition value = $taskdefinition"
              images=$(aws ecs describe-task-definition --task-definition $taskdefinition --region ${region} | jq -r '.taskDefinition.containerDefinitions[].image')
              echo "Docker image list: $images"
              sudo chmod 666 /var/run/docker.sock
              dockerlogin=$(aws ecr get-login-password --region ${region} | docker login --username AWS --password-stdin ${account}.dkr.ecr.${region}.amazonaws.com 2>&1)
              echo Docker login result: $dockerlogin
              for image in $images
                do
                  echo ***attempting to pull $image
                  dockerpull=$(docker pull $image 2>&1)
                  echo ***docker pull result: $dockerpull
                done
              echo DONE
          `;
    }
}

/**
 * User data script so that it can run for every instance refresh
 * For instances now that need to first init into warmpool and start again to ASG
 * Refer https://aws.amazon.com/premiumsupport/knowledge-center/execute-user-data-ec2/
 */
export class UserDataScriptInitializer implements IUserDataScriptInitializer {
    private readonly userData: UserData;

    constructor() {
        this.userData = UserData.custom(dedent`
            Content-Type: multipart/mixed; boundary="//"
            MIME-Version: 1.0
            
            --//
            Content-Type: text/cloud-config; charset="us-ascii"
            MIME-Version: 1.0
            Content-Transfer-Encoding: 7bit
            Content-Disposition: attachment; filename="cloud-config.txt"
            
            #cloud-config
            cloud_final_modules:
            - [scripts-user, always]
            
            --//
            Content-Type: text/x-shellscript; charset="us-ascii"
            MIME-Version: 1.0
            Content-Transfer-Encoding: 7bit
            Content-Disposition: attachment; filename="userdata.txt"
            
            #!/bin/bash
        `);

        // Automated task and image cleanup parameters
        // Reference: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/automated_image_cleanup.html
        this.userData.addCommands(dedent`
            echo ECS_IMAGE_PULL_BEHAVIOR=once >> /etc/ecs/ecs.config
            echo ECS_ENGINE_TASK_CLEANUP_WAIT_DURATION=30m >> /etc/ecs/ecs.config
            echo ECS_IMAGE_CLEANUP_INTERVAL=10m >> /etc/ecs/ecs.config
            echo ECS_IMAGE_MINIMUM_CLEANUP_AGE=10m >> /etc/ecs/ecs.config
            echo ECS_NUM_IMAGES_DELETE_PER_CYCLE=20 >> /etc/ecs/ecs.config
        `)
    }

    getUserData(): UserData {
        return this.userData;
    }
}
