import {Capacity} from "../constants/capacity";

const instanceType = 'r5.8xlarge' //32 vCPU, 256GB, 8 network interfaces
const smallMemoryLimitMiB = 8192;
const mediumMemoryLimitMiB = 16384;

export const LLM_CAPACITY: Capacity = {
    'alpha': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'beta': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        }
    },
    'gamma': {
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        }
    },
    'prod-artifactbuilder': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18
        }
    },
    'prod-regression': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18
        }
    },
    'preprod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
        }
    },
    'prod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 9
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 9
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 9
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 9
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 12,
            maxCapacity: 18,
        }
    }
}
