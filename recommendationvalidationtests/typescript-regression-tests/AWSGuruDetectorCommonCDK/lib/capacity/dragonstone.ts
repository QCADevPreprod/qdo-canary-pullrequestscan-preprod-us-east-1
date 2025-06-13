import {Capacity} from "../constants/capacity";

const instanceType = 'r5.8xlarge' //32 vCPU, 128GB, 8 network interfaces
const mediumMemoryLimitMiB = 16384;
const largeMemoryLimitMiB = 30720;

export const DRAGON_STONE_CAPACITY: Capacity = {
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
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'gamma': {
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
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
            minCapacity: 15,
            maxCapacity: 21
        }
    },
    'prod-regression': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 15,
            maxCapacity: 21
        }
    },
    'preprod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'prod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 15,
            maxCapacity: 45
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        }
    }
}
