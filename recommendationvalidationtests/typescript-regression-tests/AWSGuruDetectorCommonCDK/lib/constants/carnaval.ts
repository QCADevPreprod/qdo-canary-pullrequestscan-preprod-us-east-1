import {PROD_ARTIFACT_BUILDER_STAGE} from "./stages";
import rip = require("@amzn/rip-helper");

export function getCarnavalAggregatedRollbackAlarmName(region: string, stage: string, appPrefix: string): string {
    // prod-artifactbuilder stage carnal alarm region name is prod-ab: https://tiny.amazon.com/kssf4u9r/carnamazv1viewdo
    let overrideStage = stage == PROD_ARTIFACT_BUILDER_STAGE ? 'prod-ab' : stage;
    return `${appPrefix}.${rip.getRegion(region).airportCode}.${overrideStage}.AggregatedRollbackAlarm - Aggregate`;
}