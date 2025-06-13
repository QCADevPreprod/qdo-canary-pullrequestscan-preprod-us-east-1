export const S3_ENDPOINT_PREFIX_LIST_IDS: { [region: string]: string } = {
    'us-east-1': 'pl-63a5400a',
    'us-east-2': 'pl-7ba54012',
    'us-west-1': 'pl-6ba54002',
    'us-west-2': 'pl-68a54001',
    'eu-west-1': 'pl-6da54004',
    'eu-west-2': 'pl-7ca54015',
    'eu-central-1': 'pl-6ea54007',
    'eu-north-1': 'pl-c3aa4faa',
    'ap-northeast-1': 'pl-61a54008',
    'ap-northeast-2': 'pl-78a54011',
    'ap-southeast-1': 'pl-6fa54006',
    'ap-southeast-2': 'pl-6ca54005',
    'ap-south-1': 'pl-78a54011',
    'sa-east-1': 'pl-6aa54003',
};

export const DDB_ENDPOINT_PREFIX_LIST_IDS: { [region: string]: string } = {
    "eu-north-1": "pl-adae4bc4",
    "ap-south-1": "pl-66a7420f",
    "eu-west-2": "pl-b3a742da",
    "eu-west-1": "pl-6fa54006",
    "ap-northeast-2": "pl-48a54021",
    "ap-northeast-1": "pl-78a54011",
    "ap-southeast-1": "pl-67a5400e",
    "ap-southeast-2": "pl-62a5400b",
    "us-east-1": "pl-02cd2c6b",
    "us-east-2": "pl-4ca54025",
    "us-west-1": "pl-6ea54007",
    "us-west-2": "pl-00a54069",
    "eu-central-1": "pl-66a5400f",
};

//todo: need to change to detector hosting account later

// account for detector hosting: it contains shared lambdas and step function to generate recommendations

export const ARTIFACT_BUILDER_STAGES: Array<String> = ['alpha', 'beta', 'prod-artifactbuilder'];
export const INTERNAL_SERVICE_PRINCIPAL:string = 'guru.aws.internal';
export const EXTERNAL_SERVICE_PRINCIPAL:string = 'codeguru-reviewer.amazonaws.com';

export const FIREWALL_ALLOWED_DOMAINS = ['.cloudcover.builder-tools.aws.dev'];
// https://docs.aws.amazon.com/network-firewall/latest/developerguide/rule-group-managing.html#nwfw-rule-group-capacity
// We are currently only using 1 unit of capacity (1 protocol (TCP) * 1 domain). But this capacity cannot be changed
// once created, so keeping plenty of breathing room.
export const DOMAIN_FILTER_RULE_GROUP_CAPACITY = 1000;