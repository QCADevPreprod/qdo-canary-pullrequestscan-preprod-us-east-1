export const developerAccountId: string | undefined = '013991436161';
export const developerUsername: string | undefined = process.env.USER;

export const PROD_REGRESSION_STAGE: string = 'prod-regression';
export const PROD_ARTIFACT_BUILDER_STAGE: string = 'prod-artifactbuilder';
export const PREPROD_STAGE: string = 'preprod';
export const PROD_STAGE: string = 'prod';
export const GAMMA_STAGE: string = 'gamma';
export const BETA_STAGE: string = 'beta';
export const ALPHA_STAGE: string = 'alpha';

export const EU_NORTH_1: string = 'eu-north-1';
export const AP_SOUTHEAST_2: string = 'ap-southeast-2';
export const US_EAST_1: string = 'us-east-1';
export const US_EAST_2: string = 'us-east-2';
export const US_WEST_2: string = 'us-west-2';
export const AP_NORTHEAST_1: string = 'ap-northeast-1';
export const AP_SOUTHEAST_1: string = 'ap-southeast-1';
export const EU_CENTRAL_1: string = 'eu-central-1';
export const EU_WEST_1: string = 'eu-west-1';
export const EU_WEST_2: string = 'eu-west-2';

export const WAVE1_PROD: string = 'Wave-1-Prod';
export const WAVE2_PROD: string = 'Wave-2-Prod';
export const WAVE3_PROD: string = 'Wave-3-Prod';
export const WAVE4_PROD: string = 'Wave-4-Prod';
export const WAVE1_PREPROD: string = 'Wave-1-PreProd';
export const WAVE2_PREPROD: string = 'Wave-2-PreProd';
export const WAVE3_PREPROD: string = 'Wave-3-PreProd';
export const WAVE4_PREPROD: string = 'Wave-4-PreProd';

import {
    DRAGON_GLASS_ACCOUNTS,
    INCONSISTENCY_ACCOUNTS,
    INFER_ACCOUNTS,
    BANDIT_ACCOUNTS,
    RULESENGINE_ACCOUNTS,
    DETECTOR_HOSTING_ACCOUNTS,
    PARTITIONING_ACCOUNTS,
    DRAGONSTONE_ACCOUNTS,
    INPUT_VALIDATION_ACCOUNTS,
    BYTE_CODE_DECOMPILATION_ACCOUNTS,
    IR_EXTRACTION_ACCOUNTS,
    HARDCODED_SECRETS_ACCOUNTS,
    PENROSE_ACCOUNTS,
    CODE_REMEDIATION_ACCOUNTS,
    LLM_ACCOUNTS
} from "./accounts";

export interface Stage {
    readonly name: string;
    readonly regionalEnvironments: RegionalEnvironment[]
}

export interface RegionalEnvironment {
    readonly stage: string; // example: alpha, beta, gamma, prod
    readonly accountId: string; // aws account id
    readonly region: string; // exmaple: us-east-1, us-west-2
    readonly isProd?: boolean;
    readonly isDev?: boolean;
}

export const inconsistencyStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INCONSISTENCY_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
];

export const dragonglassStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGON_GLASS_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const dragonstoneStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DRAGONSTONE_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const byteCodeDecompilationStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
        ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BYTE_CODE_DECOMPILATION_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const IRExtractionStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
        ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: IR_EXTRACTION_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const inferStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: INFER_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: INFER_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: INFER_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: INFER_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: INFER_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INFER_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: INFER_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INFER_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const banditStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: BANDIT_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: BANDIT_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: BANDIT_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: BANDIT_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: BANDIT_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const rulesEngineStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: RULESENGINE_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: RULESENGINE_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: RULESENGINE_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: RULESENGINE_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: RULESENGINE_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const detectorHostingStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: DETECTOR_HOSTING_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const inputValidationStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: INPUT_VALIDATION_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const partitioningStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: PARTITIONING_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: PARTITIONING_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: PARTITIONING_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: PARTITIONING_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
            ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PARTITIONING_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const hardCodedSecretsStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
        ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: HARDCODED_SECRETS_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];

export const penroseStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: PENROSE_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: PENROSE_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: PENROSE_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: PENROSE_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            },
        ]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: PENROSE_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
];
export const codeRemediationStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: CODE_REMEDIATION_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
    ]
export const LLMStages: Stage[] = [
    {
        name: ALPHA_STAGE,
        regionalEnvironments: [
            {
                stage: ALPHA_STAGE,
                accountId: LLM_ACCOUNTS[ALPHA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: BETA_STAGE,
        regionalEnvironments: [
            {
                stage: BETA_STAGE,
                accountId: LLM_ACCOUNTS[BETA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: GAMMA_STAGE,
        regionalEnvironments: [
            {
                stage: GAMMA_STAGE,
                accountId: LLM_ACCOUNTS[GAMMA_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: GAMMA_STAGE,
                accountId: LLM_ACCOUNTS[GAMMA_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: PROD_REGRESSION_STAGE,
        regionalEnvironments: [
            {
                stage: PROD_REGRESSION_STAGE,
                accountId: LLM_ACCOUNTS[PROD_REGRESSION_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE3_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: false,
                isDev: false
            }]
    },
    {
        name: WAVE4_PREPROD,
        regionalEnvironments: [
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: false,
                isDev: false
            },
            {
                stage: PREPROD_STAGE,
                accountId: LLM_ACCOUNTS[PREPROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: false,
                isDev: false
            }
        ]
    },
    {
        name: WAVE1_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][EU_NORTH_1],
                region: EU_NORTH_1,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE2_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_2],
                region: AP_SOUTHEAST_2,
                isProd: true,
                isDev: false
            },
        ]
    },
    {
        name: WAVE3_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][US_EAST_1],
                region: US_EAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][US_EAST_2],
                region: US_EAST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_ARTIFACT_BUILDER_STAGE,
                accountId: LLM_ACCOUNTS[PROD_ARTIFACT_BUILDER_STAGE][US_WEST_2],
                region: US_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    },
    {
        name: WAVE4_PROD,
        regionalEnvironments: [
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][AP_NORTHEAST_1],
                region: AP_NORTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][AP_SOUTHEAST_1],
                region: AP_SOUTHEAST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][EU_CENTRAL_1],
                region: EU_CENTRAL_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][EU_WEST_1],
                region: EU_WEST_1,
                isProd: true,
                isDev: false
            },
            {
                stage: PROD_STAGE,
                accountId: LLM_ACCOUNTS[PROD_STAGE][EU_WEST_2],
                region: EU_WEST_2,
                isProd: true,
                isDev: false
            }
        ]
    }
    
];

// for dev account test
export const devStage: RegionalEnvironment = {
    stage: BETA_STAGE,
    accountId: developerAccountId,
    region: "us-west-2",
    isProd: false,
    isDev: true
}