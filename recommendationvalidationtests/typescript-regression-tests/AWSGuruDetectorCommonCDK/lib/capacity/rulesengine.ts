import {Capacity} from "../constants/capacity";

const instanceType = 'r5.8xlarge' //32 vCPU, 128GB, 8 network interfaces
const smallMemoryLimitMiB = 8192;
const mediumMemoryLimitMiB = 16384;
const largeMemoryLimitMiB = 30720;

export const RULES_ENGINE_CAPACITY: Capacity = {
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
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'gamma': {
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
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
            minCapacity: 30,
            maxCapacity: 45
        }
    },
    'prod-regression': {
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 30,
            maxCapacity: 45
        }
    },
    'preprod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 2,
            maxCapacity: 3
        }
    },
    'prod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 54,
            maxCapacity: 108
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        }
    }
}
