import {PROD_STAGE} from "./stages";

export const DEV_OPS_REGIONS = [
    'us-east-1',
    'us-east-2',
    'us-west-2',
    'ap-northeast-1',
    'eu-west-1',
];
export function shouldEnableDevOpsGuru(region: string, stage: string): boolean {
    const isProd = stage == PROD_STAGE;
    const hasOpsGuru = DEV_OPS_REGIONS.includes(region);
    const devOpsGuruEnabled = isProd && hasOpsGuru;
    return devOpsGuruEnabled;
}