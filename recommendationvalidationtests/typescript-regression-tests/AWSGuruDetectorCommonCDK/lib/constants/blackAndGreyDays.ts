import {TimeWindowBlocker} from "@amzn/pipelines";

export const blackAndGreyTimeWindow: { [region: string]: TimeWindowBlocker } = {
    'us-east-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_US,
    'us-east-2': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_US,
    'us-west-2': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_US,
    'eu-central-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_EU,
    'eu-north-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_EU,
    'eu-west-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_EU,
    'eu-west-2': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_EU,
    'ap-northeast-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_JP,
    'ap-southeast-1': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_GLOBAL,
    'ap-southeast-2': TimeWindowBlocker.BLOCKED_AND_RESTRICTED_DAYS_GLOBAL
}
