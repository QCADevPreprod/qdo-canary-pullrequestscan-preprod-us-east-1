//Bake time in minutes for service
import {GAMMA_STAGE, PREPROD_STAGE, PROD_ARTIFACT_BUILDER_STAGE, PROD_STAGE, WAVE1_PROD} from "./stages";

export const BAKE_TIME_PREPROD_SERVICE_IN_MINUTES = 60;
export const BAKE_TIME_PROD_FIRST_SERVICE_IN_MINUTES = 720;
export const BAKE_TIME_PROD_SERVICE_IN_MINUTES = 360;
export const BAKE_TIME_PREPROD_ROLLBACK_SERVICE_IN_MINUTES = 30;
export const BAKE_TIME_PROD_ROLLBACK_SERVICE_IN_MINUTES = 30;
//Bake time in minutes for infrastructure
export const BAKE_TIME_PREPROD_INFRA_IN_MINUTES = 60;
export const BAKE_TIME_PROD_FIRST_INFRA_IN_MINUTES = 720;
export const BAKE_TIME_PROD_INFRA_IN_MINUTES = 360;
export const BAKE_TIME_PREPROD_ROLLBACK_INFRA_IN_MINUTES = 30;
export const BAKE_TIME_PROD_ROLLBACK_INFRA_IN_MINUTES = 30;

export const BAKE_TIME_GAMMA_IN_MINUTES = 15;


export class BakeTimeProvider {

    /**
     * Method to get bake time in minutes for given stage.
     * @param stage stage of current environment, example: beta, gamma, preprod, prod
     * @param pipelineStage pipeline stage of current environment, example: beta, gamma,Wave-1-PreProd, Wave-2-Prod
     * @param isInfrastructure if pipeline is infrastructure pipeline
     */
    public static getBakeTimeInMinutes(stage: string, pipelineStage: string, isInfrastructure?: boolean): number {
        let bakeTimeInMinutes;
        switch (stage) {
            case PREPROD_STAGE:
                bakeTimeInMinutes = isInfrastructure
                    ? BAKE_TIME_PREPROD_INFRA_IN_MINUTES
                    : BAKE_TIME_PREPROD_SERVICE_IN_MINUTES;
                break;
            case PROD_STAGE:
            case PROD_ARTIFACT_BUILDER_STAGE:
                if (WAVE1_PROD == pipelineStage) {
                    bakeTimeInMinutes = isInfrastructure
                        ? BAKE_TIME_PROD_FIRST_INFRA_IN_MINUTES
                        : BAKE_TIME_PROD_FIRST_SERVICE_IN_MINUTES;
                } else {
                    bakeTimeInMinutes = isInfrastructure
                        ? BAKE_TIME_PROD_INFRA_IN_MINUTES
                        : BAKE_TIME_PROD_SERVICE_IN_MINUTES;
                }
                break;
            default:
                bakeTimeInMinutes = 0;
                break;
        }
        return bakeTimeInMinutes;
    }

    /**
     * Method to get rollback bake time in minutes for given stage.
     * @param stage stage of current environment, example: beta, gamma, preprod, prod
     * @param pipelineStage pipeline stage of current enviroment, example: beta, gamma,Wave-1-PreProd, Wave-2-Prod
     * @param isInfrastructure if pipeline is infrastructure pipeline
     */
    public static getRollbackBakeTimeInMinutes(stage: string, pipelineStage: string, isInfrastructure?: boolean): number {
        let bakeTimeInMinutes;
        switch (stage) {
            case GAMMA_STAGE:
                bakeTimeInMinutes = BAKE_TIME_GAMMA_IN_MINUTES;
                break;
            case PREPROD_STAGE:
                bakeTimeInMinutes = isInfrastructure
                    ? BAKE_TIME_PREPROD_ROLLBACK_INFRA_IN_MINUTES
                    : BAKE_TIME_PREPROD_ROLLBACK_SERVICE_IN_MINUTES;
                break;
            case PROD_STAGE:
            case PROD_ARTIFACT_BUILDER_STAGE:
                bakeTimeInMinutes = isInfrastructure
                    ? BAKE_TIME_PROD_ROLLBACK_INFRA_IN_MINUTES
                    : BAKE_TIME_PROD_ROLLBACK_SERVICE_IN_MINUTES;

                break;
            default:
                bakeTimeInMinutes = 0;
                break;
        }
        return bakeTimeInMinutes;
    }
}
