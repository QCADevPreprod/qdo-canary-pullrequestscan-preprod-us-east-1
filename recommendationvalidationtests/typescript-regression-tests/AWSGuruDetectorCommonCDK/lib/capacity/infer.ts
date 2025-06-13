import {Capacity} from "../constants/capacity";

const instanceType = 'm5.8xlarge' //32 vCPU, 128GB, 8 network interfaces
const smallMemoryLimitMiB = 8192;
const mediumMemoryLimitMiB = 16384;

export const INFER_CAPACITY: Capacity = {
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
            memoryLimitMiB: mediumMemoryLimitMiB,
            minCapacity: 3,
            maxCapacity: 6
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
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 1,
            maxCapacity: 3
        }
    },
    'prod': {
        'eu-north-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-southeast-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'us-east-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'us-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 9,
            maxCapacity: 27
        },
        'us-east-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-northeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'ap-southeast-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-central-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-west-1': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        },
        'eu-west-2': {
            instanceType: instanceType,
            memoryLimitMiB: smallMemoryLimitMiB,
            minCapacity: 6,
            maxCapacity: 12
        }
    }
}
