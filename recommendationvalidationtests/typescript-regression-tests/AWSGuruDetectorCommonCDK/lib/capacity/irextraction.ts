import {Capacity} from "../constants/capacity";

const instanceType = 'r5.8xlarge' //32 vCPU, 128GB, 8 network interfaces
const mediumMemoryLimitMiB = 16384;
const largeMemoryLimitMiB = 30720;

export const IR_EXTRACTION_CAPACITY: Capacity = {
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
            maxCapacity: 30
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
            minCapacity: 45,
            maxCapacity: 90
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
            minCapacity: 23,
            maxCapacity: 32
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: largeMemoryLimitMiB,
            minCapacity: 45,
            maxCapacity: 63
        }
    }
}
