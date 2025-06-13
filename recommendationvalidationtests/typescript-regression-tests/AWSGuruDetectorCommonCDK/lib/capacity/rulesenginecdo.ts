import {Capacity} from "../constants/capacity";

const instanceType = 'r5.8xlarge' //32 vCPU, 128GB, 8 network interfaces
const mediumMemoryLimitMiB = 16384;
const largeMemoryLimitMiB = 30720;

export const RULES_ENGINE_CDO_CAPACITY: Capacity = {
    'alpha': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'beta': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'gamma': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        }
    },
    'prod-artifactbuilder': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18
        }
    },
    'prod-regression': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18
        }
    },
    'preprod': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'prod': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 27,
            maxCapacity: 45
        }
    }
}
