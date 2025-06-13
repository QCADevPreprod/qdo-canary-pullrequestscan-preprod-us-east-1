export const LOWER_THRESHOLD = 20;
export const UPPER_THRESHOLD_STEP1 = 50;
export const UPPER_THRESHOLD_STEP2 = 65;
export const UPPER_THRESHOLD_STEP3 = 80;

//Autoscaling thresholds based on the size of the SQS queue.
//Detectors should respond to requests very quickly, as the Hosting stack will timeout in 10min.
//The queue size should therefore always be very small and stay close to 0.
//If the size increase to more than 10, we need to add additionl EC2 capacity to handle the load.
//If the size increase more than 25, we should bring in additional capacity faster.
export const LOWER_SQS_THRESHOLD = 0;
export const UPPER_SQS_THRESHOLD_STEP1 = 10;
export const UPPER_SQS_THRESHOLD_STEP2 = 25;
export const UPPER_SQS_THRESHOLD_STEP3 = 50;

export const MAX_TASKS_PER_HOST = 7;
// The number of tasks/per is determined by memory needed by the task vs the memory available on the host
// as well as by the number of network interfaces available on the host (1 network interface / task).
// We choose the instante type to accomodate at least 7 tasks per host.
// See https://quip-amazon.com/gwRDAfVACnKd/GuruArtifactBuilder-Internal-Detectors-on-EC2-ORR