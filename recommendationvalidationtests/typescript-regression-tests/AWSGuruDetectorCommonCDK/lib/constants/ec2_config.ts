/*
 * During the rolling update we will be deploying 10% of the minimum capacity. Default value for maxBatchSize is 1
 */
export const ASG_ROLLING_UPDATE_BATCH_SIZE_PERC = 0.05;
export const ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES = 2; // time taken by service task to be declared healthy once it starts.
export const PREPROD_ASG_ROLLING_UPDATE_PAUSE_TIME_MINUTES = 10;
