import {
    DeploymentGroupStage,
    DeploymentGroupTarget,
    IBaseStack,
    IChangeSetApprovalFunction,
    Pipeline
} from "@amzn/pipelines";
import {ALPHA_STAGE} from "../constants/stages";

export class GuruDetectorChangeSetApprove implements IChangeSetApprovalFunction {
    // the actual code create csa approve for the previous stage of the stage in predicate.
    // we only need csa approve in packaging stage and pipeline stage, the rest stage should
    // be done through integration test
    predicate(pipeline: Pipeline, stage: DeploymentGroupStage, target: DeploymentGroupTarget, stack: IBaseStack): boolean {
        if (stage === undefined) return false;
        return stage.name === 'Pipeline' || stage.name.toLowerCase() === ALPHA_STAGE;
    }
}