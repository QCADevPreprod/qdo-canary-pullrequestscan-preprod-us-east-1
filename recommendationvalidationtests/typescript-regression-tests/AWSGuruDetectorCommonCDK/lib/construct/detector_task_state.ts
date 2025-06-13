import { Duration, Stack } from 'monocdk';
import { PolicyStatement } from 'monocdk/aws-iam';
import { State, TaskMetricsConfig, TaskStateBase, TaskStateBaseProps } from 'monocdk/aws-stepfunctions';
import { DETECTOR_HOSTING_WORKFLOW_HEARTBEAT_SECONDS, MAX_DETECTOR_TASK_TIMEOUT_SECONDS } from "../constants/timeouts";
 
export interface DetectorTaskStateProps extends TaskStateBaseProps {
  readonly fallbackState: State;
  readonly region: string;
  readonly stage: string;
}
 
export class DetectorTaskState extends TaskStateBase {
 
  protected taskMetrics?: TaskMetricsConfig;
  protected taskPolicies?: PolicyStatement[];
 
  private readonly taskResourceArn: string;
  private readonly region: string;
  private readonly stage: string;
 
  constructor(scope: Stack, id: string, private readonly props: DetectorTaskStateProps) {
    super(scope, id, props);
    this.taskResourceArn = `arn:${scope.partition}:states:::sqs:sendMessage.waitForTaskToken`;
    this.region = props.region;
    this.stage = props.stage;
    this.addRetry({
      errors: [
        "ERROR", // Retry on all 5XXs thrown from processing worker
        "States.Timeout", // Retry on timeout
        "SQS.SdkClientException", // Retry on SQS client exception e.g. unable to connect to SQS endpoint or I/O failures
        "SQS.AmazonSQSException", // Retry on SQS 5XXs. e.g SQS throttling exception
        "FailUnknownException"
      ],
      interval: Duration.seconds(60), // Make 3 attempts after waiting for 0, 60, 660 seconds
      maxAttempts: 3,
      backoffRate: 10.0
    })
    this.addCatch(props.fallbackState, {
      errors: [
        "States.ALL"
      ]
    });
  }
 
  protected _renderTask(): any {
    return {
      Resource: this.taskResourceArn,
      TimeoutSeconds: MAX_DETECTOR_TASK_TIMEOUT_SECONDS.get(this.stage)!,
      HeartbeatSeconds: DETECTOR_HOSTING_WORKFLOW_HEARTBEAT_SECONDS.get(this.stage)!,
      Parameters: {
        "QueueUrl.$": `States.Format('https://sqs.${this.region}.amazonaws.com/{}/{}',
            $.detectorAccount, $.taskInputQueue)`,
        "MessageBody": {
          "taskToken.$" : "$$.Task.Token",
          "detectorTaskInput.$" : "$.detectorTaskInput"
        }
      }
    };
  }
}