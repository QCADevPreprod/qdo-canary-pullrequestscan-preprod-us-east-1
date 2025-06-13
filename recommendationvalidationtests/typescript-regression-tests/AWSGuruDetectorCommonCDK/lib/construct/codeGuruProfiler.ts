import cdk = require('monocdk');
import {Effect, ManagedPolicy, PolicyStatement} from "monocdk/aws-iam";
import {ProfilingGroup} from "monocdk/aws-codeguruprofiler";
import {Construct} from "monocdk";

export interface CodeGuruProfilerProps {
    /**
     * A name for the profiling group to create.
     */
    readonly profilingGroupName: string;
}

export class CodeGuruProfiler extends Construct {
    readonly profilingGroup : ProfilingGroup;
    readonly codeGuruProfilerAgentManagedPolicy: ManagedPolicy;

    constructor(scope: cdk.Construct, id: string, props: CodeGuruProfilerProps) {
        super(scope, id);

        this.profilingGroup = new ProfilingGroup(this, 'CodeGuruProfilingGroup', {
            profilingGroupName: props.profilingGroupName
        })
        this.codeGuruProfilerAgentManagedPolicy = new ManagedPolicy(
            this, 'CodeGuruProfilerAgentManagedPolicy', {
                managedPolicyName: `CodeGuruProfilerAgentManagedPolicy-${props.profilingGroupName}`,
                statements: [
                    new PolicyStatement({
                        effect: Effect.ALLOW,
                        actions: [
                            'codeguru-profiler:ConfigureAgent',
                            'codeguru-profiler:PostAgentProfile',
                        ],
                        resources: [
                            this.profilingGroup.profilingGroupArn
                        ],
                    }),
                ],
            },
        );
    }
}