import core = require('monocdk');
import ec2 = require("monocdk/aws-ec2");
import iam = require("monocdk/aws-iam");
import {
    AclCidr,
    AclTraffic,
    Action,
    CfnGatewayRouteTableAssociation,
    CfnRoute,
    CfnRouteTable,
    DefaultInstanceTenancy,
    FlowLog,
    FlowLogDestination,
    FlowLogResourceType,
    GatewayVpcEndpoint,
    GatewayVpcEndpointAwsService,
    InterfaceVpcEndpoint,
    InterfaceVpcEndpointAwsService,
    InterfaceVpcEndpointService,
    NetworkAcl,
    Peer,
    Port,
    SecurityGroup,
    SubnetType,
    TrafficDirection,
    Vpc as EC2Vpc
} from 'monocdk/aws-ec2';
import {LogGroup, RetentionDays} from "monocdk/aws-logs";
import {CfnOutput, Fn, Tags} from "monocdk";
import {DeploymentEnvironment, DeploymentStack, DogmaTagsOptions, SoftwareType} from '@amzn/pipelines';
import {S3_ENDPOINT_PREFIX_LIST_IDS,
        DDB_ENDPOINT_PREFIX_LIST_IDS,
        DOMAIN_FILTER_RULE_GROUP_CAPACITY,
        FIREWALL_ALLOWED_DOMAINS} from './constants/facts';
import {SAGEMAKER_ACCOUNTS} from './constants/accounts';
import { CfnFirewall, CfnFirewallPolicy, CfnRuleGroup } from "monocdk/aws-networkfirewall";

// If you want to add parameters for your CDK Stack, you can toss them in here
export interface VpcProps {
    readonly vpcName: string;
    readonly env: DeploymentEnvironment;
    readonly stage: string;
    readonly stackName?: string;
    readonly vpcLogGroupName: string
    readonly securityGroupName: string
    readonly noOutboundSecurityGroupName: string
    /**
     * Stack tags that will be applied to all the taggable resources and the stack itself.
     *
     * @default {}
     */
    readonly tags?: {
        [key: string]: string;
    };
    /**
     * Optional Dogma tags. Read `DogmaTags` for mode details or
     * this wiki https://w.amazon.com/bin/view/ReleaseExcellence/Team/Designs/PDGTargetSupport/Tags/
     */
    readonly dogmaTags?: DogmaTagsOptions;
    readonly enableFirewall? : boolean
}

export function createVPCWithFirewall(stack: DeploymentStack, region: string): EC2Vpc{
    const vpc = new EC2Vpc(stack, 'Vpc', {
        cidr: '10.0.0.0/16',
        // VPC stack fails in 2 AZs regions if we don't specify maxAZs = 2
        maxAzs: Vpc.twoZoneRegions.includes(region) ? 2 : 3,
        defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
        subnetConfiguration: [
            {
                subnetType: SubnetType.PRIVATE_WITH_NAT,
                cidrMask: 20,
                name: 'Isolated'
            },
            {
                subnetType: SubnetType.PUBLIC,
                cidrMask: 20,
                name: "Public",
            },
            // create separate subnet for Firewall. This subnet MUST have no other resources
            {
                subnetType: SubnetType.PUBLIC,
                // no reason to have more than 16 endpoints in this subnet
                cidrMask: 28,
                name: "Firewall",
            },
        ]
    });
    return vpc
}

export function createIsolatedVPC(stack: DeploymentStack, region: string): EC2Vpc{
    // create VPC with isolated subnets only
    const vpc = new EC2Vpc(stack, 'Vpc', {
        cidr: '10.0.0.0/16',
        // VPC stack fails in 2 AZs regions if we don't specify maxAZs = 2
        maxAzs: Vpc.twoZoneRegions.includes(region) ? 2 : 3,
        defaultInstanceTenancy: DefaultInstanceTenancy.DEFAULT,
        subnetConfiguration: [
            {
                subnetType: SubnetType.ISOLATED,
                cidrMask: 20,
                name: 'Isolated'
            },
        ]
    });
    return vpc
}

export class Vpc extends DeploymentStack {

    static readonly twoZoneRegions: Array<string> = ['us-west-1', 'ca-central-1', 'sa-east-1'];
    public readonly vpc: EC2Vpc;
    public readonly noOutboundSecurityGroup: SecurityGroup;
    private vpcIdOutput: CfnOutput;
    public readonly isolatedSubnets: ec2.SelectedSubnets;
    private readonly publicSubnets: ec2.SelectedSubnets;
    private readonly firewallSubnets: ec2.SelectedSubnets;

    constructor(parent: core.App, name: string, props: VpcProps) {
        super(parent, name, {
            softwareType: SoftwareType.INFRASTRUCTURE,
            ...props
        });

        if (props.enableFirewall) {
            this.vpc = createVPCWithFirewall(this, props.env.region)
        } else {
            this.vpc = createIsolatedVPC(this, props.env.region)
        }

        new FlowLog(this, 'VPCFlowLogs', {
            resourceType: FlowLogResourceType.fromVpc(this.vpc),
            destination: FlowLogDestination.toCloudWatchLogs(
                new LogGroup(this, 'LogGroup', {
                    retention: RetentionDays.INFINITE,
                    logGroupName: props.vpcLogGroupName
                }),
            ),
        });

        // export VPC ID
        this.vpcIdOutput = new CfnOutput(this, 'VpcId', {
            value: this.vpc.vpcId,
            exportName: props.vpcName
        });

        if (props.enableFirewall) {
            this.isolatedSubnets = this.vpc.selectSubnets({
                subnetType: SubnetType.PRIVATE_WITH_NAT,
            });

            this.publicSubnets = this.vpc.selectSubnets({
                subnetGroupName: "Public",
            });

            this.firewallSubnets = this.vpc.selectSubnets({
                subnetGroupName: "Firewall",
            });

            this.createNetworkFirewall();
        } else {
            this.isolatedSubnets = this.vpc.selectSubnets({
                subnetType: SubnetType.ISOLATED,
            });
        }

        // See network infra doc here: https://quip-amazon.com/oSEPAnBaOIbq/Inference-Detector-Hosting-Network
        // security group to manage traffic of private link interface endpoints and gateway endpoints
        const privateLinkSecurityGroup = new ec2.SecurityGroup(this, props.securityGroupName, {
            securityGroupName: props.securityGroupName,
            description: "Allowing all outgoing traffic",
            vpc: this.vpc,
            allowAllOutbound: true,
        });

        // VPC private link
        // Interface endpoints
        const ecrDkrEndpoint = new InterfaceVpcEndpoint(this, 'ECR-DKR-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.ECR_DOCKER,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        const ecrApiEndpoint = new InterfaceVpcEndpoint(this, 'ECR-API-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.ECR,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        const cwLogEndpoint = new InterfaceVpcEndpoint(this, 'CW-LOGS-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.CLOUDWATCH_LOGS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        const cwEndpoint = new InterfaceVpcEndpoint(this, 'CW-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.CLOUDWATCH,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        // aws ecs describe-tasks
        // aws ecs describe-task-definition
        const ecsEndpoint = new InterfaceVpcEndpoint(this, 'ECS-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.ECS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        const ecsAgentEndpoint = new InterfaceVpcEndpoint(this, 'ECS-AGENT-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.ECS_AGENT,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        // aws ec2 describe-subnets
        const ec2Endpoint = new InterfaceVpcEndpoint(this, 'EC2-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.EC2,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });
        // aws kms decrypt/encrypt
        const kmsEndpoint = new InterfaceVpcEndpoint(this, 'KMS-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.KMS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // aws ssm
        const ssmEndpoint = new InterfaceVpcEndpoint(this, 'SSM-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.SSM,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // aws sqs
        const sqsEndpoint = new InterfaceVpcEndpoint(this, 'SQS-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.SQS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // aws cloudformation
        const cloudformationEndpoint = new InterfaceVpcEndpoint(this, 'CLOUDFORMATION-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.CLOUDFORMATION,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // aws ssm messages
        const ssmMessagesEndpoint = new InterfaceVpcEndpoint(this, 'SSM_MESSAGES-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.SSM_MESSAGES,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // aws ecs telemetry (ContainerInsights)
        const telemetryMessagesEndpoint = new InterfaceVpcEndpoint(this, 'ECS_TELEMETRY-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.ECS_TELEMETRY,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // create private link with aws autoscaling
        const autoscalingEndpoint = new InterfaceVpcEndpoint(this, 'Autoscaling-Endpoint', {
            vpc: this.vpc,
            service: new InterfaceVpcEndpointAwsService('autoscaling'),
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        // Gateway endpoints
        const s3Endpoint = new GatewayVpcEndpoint(this, 'S3-Endpoint', {
            vpc: this.vpc,
            service: GatewayVpcEndpointAwsService.S3,
            subnets: [this.isolatedSubnets]
        });

        const dynamoDBEndpoint = new GatewayVpcEndpoint(this, "Aws-DynamoDb-Endpoint", {
            vpc: this.vpc,
            service: GatewayVpcEndpointAwsService.DYNAMODB,
            subnets: [this.isolatedSubnets],
        });

        const stsEndpoint = new InterfaceVpcEndpoint(this, 'STS-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.STS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        const stepFunctionsEndpoint = new InterfaceVpcEndpoint(this, 'StepFunctions-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.STEP_FUNCTIONS,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        const codeGuruProfilerEndpoint = new InterfaceVpcEndpoint(this, 'CodeGuruProfiler-Endpoint', {
            vpc: this.vpc,
            service: new InterfaceVpcEndpointService(`com.amazonaws.${props.env.region}.codeguru-profiler`),
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        const sagemakerEndpoint = new InterfaceVpcEndpoint(this, 'SageMaker-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.SAGEMAKER_API,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup]
        });

        const sagemakerAccount = SAGEMAKER_ACCOUNTS[props.stage][props.env.region]
        const sagemakerRuntimeEndpoint = new InterfaceVpcEndpoint(this, 'SageMakerRuntime-Endpoint', {
            vpc: this.vpc,
            service: InterfaceVpcEndpointAwsService.SAGEMAKER_RUNTIME,
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup],
            privateDnsEnabled: true
        });
        sagemakerRuntimeEndpoint.addToPolicy(new iam.PolicyStatement({
            principals: [new iam.AnyPrincipal()],
            effect: iam.Effect.ALLOW,
            resources: [`arn:aws:sagemaker:${props.env.region}:${sagemakerAccount}:endpoint/awsguru*`],
            actions: ['sagemaker:InvokeEndpoint'],
        }))

        // Add Chronicle Endpoint
        // Defining Chronicle Collection Endpoint
        const chronicleCollectionEndpoint = new InterfaceVpcEndpoint(this, 'ChronicleCollection-Endpoint', {
            vpc: this.vpc,
            service: new InterfaceVpcEndpointService(`collection.prod.${props.env.region}.chronicle.security.aws.a2z.com`),
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup],
            privateDnsEnabled: true
        });

        // Defining Chronicle Control Endpoint
        const chronicleControlEndpoint = new InterfaceVpcEndpoint(this, 'ChronicleControl-Endpoint', {
            vpc: this.vpc,
            service: new InterfaceVpcEndpointService(`control.prod.${props.env.region}.chronicle.security.aws.a2z.com`),
            subnets: this.isolatedSubnets,
            securityGroups: [privateLinkSecurityGroup],
            privateDnsEnabled: true
        });

        // Secruity group with no outbound traffic
        this.noOutboundSecurityGroup = new ec2.SecurityGroup(this, props.noOutboundSecurityGroupName, {
            securityGroupName: props.noOutboundSecurityGroupName,
            vpc: this.vpc,
            allowAllOutbound: false,
        });

        Tags.of(this.noOutboundSecurityGroup).add("security-group-type", "NoOutbound");

        const s3PrefixList = ec2.Peer.prefixList(S3_ENDPOINT_PREFIX_LIST_IDS[this.region]);
        this.noOutboundSecurityGroup.connections.allowTo(privateLinkSecurityGroup, Port.tcp(443));
        this.noOutboundSecurityGroup.connections.allowTo(s3PrefixList, Port.tcp(443));
        this.noOutboundSecurityGroup.connections.allowFrom(privateLinkSecurityGroup, Port.tcp(443));
        this.noOutboundSecurityGroup.connections.allowFrom(s3PrefixList, Port.tcp(443));

        const ddbPrefixList = ec2.Peer.prefixList(DDB_ENDPOINT_PREFIX_LIST_IDS[this.region]);
        this.noOutboundSecurityGroup.connections.allowTo(ddbPrefixList, Port.tcp(443));
        this.noOutboundSecurityGroup.connections.allowFrom(ddbPrefixList, Port.tcp(443));

        // SG allows access to entire IP space, but RouteTable allows only to the NAT Gateway. So this is safe.
        this.noOutboundSecurityGroup.connections.allowTo(Peer.anyIpv4(), Port.tcp(443), "Allow https access to any service");

        privateLinkSecurityGroup.connections.allowFrom(this.noOutboundSecurityGroup, Port.tcp(443));

        // --------------------------------------------------------------------//
        // Network ACL
        // https://docs.aws.amazon.com/vpc/latest/userguide/vpc-network-acls.html#custom-network-acl
        // --------------------------------------------------------------------//
        const networkAcl = new NetworkAcl(this, 'network-acl', {
            vpc: this.vpc
        });
        if (props.enableFirewall) {
            networkAcl.associateWithSubnet("Isolated", {
                subnetType: SubnetType.PRIVATE_WITH_NAT,
            });
        } else {
            networkAcl.associateWithSubnet("Isolated", {
                subnetType: SubnetType.ISOLATED,
            });
        }
        networkAcl.addEntry('SSH (22) IN', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(22),
            direction: TrafficDirection.INGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 100
        });
        networkAcl.addEntry('HTTPS (443) IN', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(443),
            direction: TrafficDirection.INGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 120
        });
        networkAcl.addEntry('HTTP (80) IN', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(80),
            direction: TrafficDirection.INGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 130
        });
        networkAcl.addEntry('Custom TCP IN', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPortRange(1024, 65535),
            direction: TrafficDirection.INGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 140
        });
        networkAcl.addEntry('SSH (22) OUT', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(22),
            direction: TrafficDirection.EGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 100
        });
        networkAcl.addEntry('HTTPS (443) OUT', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(443),
            direction: TrafficDirection.EGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 120
        });
        networkAcl.addEntry('HTTP (80) OUT', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPort(80),
            direction: TrafficDirection.EGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 130
        });
        networkAcl.addEntry('Custom TCP OUT', {
            cidr: AclCidr.ipv4("0.0.0.0/0"),
            traffic: AclTraffic.tcpPortRange(1024, 65535),
            direction: TrafficDirection.EGRESS,
            ruleAction: Action.ALLOW,
            ruleNumber: 140
        });
    }

    /**
     * Firewall Architecture:
     * https://github.com/aws-samples/aws-networkfirewall-cfn-templates/blob/main/distributed_architecture/README.md
     */
     private createNetworkFirewall() {
        // Create firewall rules
        const httpsDomainFilterRuleGroupName = `HttpsDomainFilterRuleGroup`;
        const domainFilterRuleGroup = new CfnRuleGroup(this, httpsDomainFilterRuleGroupName, {
            capacity: DOMAIN_FILTER_RULE_GROUP_CAPACITY,
            description: "Allow list specified domains. Deny everything else.",
            ruleGroupName: httpsDomainFilterRuleGroupName,
            type: "STATEFUL",
            ruleGroup: {
                rulesSource: {
                    rulesSourceList: {
                        targetTypes: ["TLS_SNI"],
                        targets: FIREWALL_ALLOWED_DOMAINS,
                        generatedRulesType: "ALLOWLIST",
                    },
                },
            },
        });

        const firewallPolicyName = `DomainFilterNetworkFirewallPolicy`;
        const firewallPolicy = new CfnFirewallPolicy(this, firewallPolicyName, {
            firewallPolicy: {
                // TODO: Add filter to drop non-https traffic
                statelessDefaultActions: ["aws:forward_to_sfe"],
                statelessFragmentDefaultActions: ["aws:forward_to_sfe"],
                statefulRuleGroupReferences: [
                    {
                        resourceArn: domainFilterRuleGroup.attrRuleGroupArn,
                    },
                ],
            },
            firewallPolicyName: firewallPolicyName,
        });

        // Create firewall. A VPC Endpoint is automatically created in each subnet specified
        const firewallName = `NetworkFirewall`;
        const firewall = new CfnFirewall(this, firewallName, {
            firewallPolicyArn: firewallPolicy.ref,
            firewallName: firewallName,
            vpcId: this.vpc.vpcId,
            subnetMappings: this.firewallSubnets.subnetIds.map((id) => ({ subnetId: id })),
        });

        /*
            there's a complication because firewall.attrEndpointIds doesn't sort the endpoints it returns.
            This makes it difficult to connect the public subnets to the specific firewall endpoint in same AZ.
            Unclear if this sorting solution works since I couldn't find a CDK based example used elsewhere.
            The suggested solution is to use a custom resource to describe and sort the endpoints.
            https://answers.amazon.com/posts/181668

            TODO: Validate if the sorting works and implement the CustomResource if it does not.
        */
        // sort endpoints by AZ. works since the endpoint id has the AZ at the start (us-west-2c:vpce-111122223333)
        const firewallEndpoints = firewall.attrEndpointIds.sort((id1, id2) => (id1 > id2 ? 1 : -1));
        // sort the public subnets by AZ so that the correct endpoints can be mapped
        const sortedPublicSubnets = this.publicSubnets.subnets.sort((s1, s2) =>
            s1.availabilityZone > s2.availabilityZone ? 1 : -1
        );

        // create route from Public subnet to Firewall endpoints for traffic going to the internet
        sortedPublicSubnets.forEach((subnet, idx) => {
            const firewallEndpointId = Fn.select(1, Fn.split(":", Fn.select(idx, firewallEndpoints)));
            const defaultRoute = subnet.node.tryFindChild("DefaultRoute") as CfnRoute | undefined;
            // remove IGW from the default route
            defaultRoute?.addPropertyDeletionOverride("GatewayId");
            // replace it with the firewall endpoint instead
            defaultRoute?.addPropertyOverride("VpcEndpointId", firewallEndpointId);
            return defaultRoute;
        });

        // create return route from IGW to Firewall
        const igwRoutingTable = new CfnRouteTable(this, "InternetGatewayRouteTable", {
            vpcId: this.vpc.vpcId,
        });

        new CfnGatewayRouteTableAssociation(this, "InternetGatewayRouteTableAssociation", {
            gatewayId: this.vpc.internetGatewayId!,
            routeTableId: igwRoutingTable.attrRouteTableId,
        });

        sortedPublicSubnets.forEach((subnet, idx) => {
            const firewallEndpointId = Fn.select(1, Fn.split(":", Fn.select(idx, firewallEndpoints)));
            new CfnRoute(this, `InternetGatewayToFirewallRoute${idx + 1}`, {
                destinationCidrBlock: subnet.ipv4CidrBlock,
                routeTableId: igwRoutingTable.attrRouteTableId,
                vpcEndpointId: firewallEndpointId,
            });
        });
    }
}
