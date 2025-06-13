import {
    IMetric,
    MathExpression,
    Metric,
    Unit
} from "monocdk/aws-cloudwatch";
import { Duration } from "monocdk";

export function sqsNumberOfMessagesVisibleMetric(queueName : string): Metric {
    return new Metric({
        metricName: 'ApproximateNumberOfMessagesVisible',
        namespace: 'AWS/SQS',
        dimensions: {
            QueueName: queueName
        },
        period: Duration.minutes(1),
        unit: Unit.COUNT,
        statistic: 'Maximum'
    });
}

export function containerInstanceUtilizationRatioMetric(appPrefix: string, maxTasks : number): IMetric {
    return new MathExpression({
        expression: '100*(m1/(m2*m3))',
        label: 'ContainerUtilizationRate',
        usingMetrics: {
            m1: taskCountMetric(appPrefix),
            m2: containerInstanceCountMetric(appPrefix),
            m3: maxTasksPerInstance(maxTasks)
        },
        period: Duration.minutes(1)
    });
}

function containerInstanceCountMetric(appPrefix : string): Metric {
    return new Metric({
        metricName: 'ContainerInstanceCount',
        namespace: 'ECS/ContainerInsights',
        dimensions: {
            ClusterName: `${appPrefix}EcsCluster`
        },
        period: Duration.minutes(1),
        unit: Unit.COUNT,
        statistic: 'Maximum'
    });
}

function taskCountMetric(appPrefix : string): Metric {
    return new Metric({
        metricName: 'TaskCount',
        namespace: 'ECS/ContainerInsights',
        dimensions: {
            ClusterName: `${appPrefix}EcsCluster`
        },
        period: Duration.minutes(1),
        unit: Unit.COUNT,
        statistic: 'Maximum'
    });
}

function maxTasksPerInstance(maxTasks : number): IMetric {
    return new MathExpression({
        expression: `${maxTasks}`,
        label: 'maxTasksPerInstance',
        usingMetrics: {},
        period: Duration.minutes(1)
    });
}