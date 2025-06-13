
import * as iam from "monocdk/aws-iam";
import { Asset } from "monocdk/aws-s3-assets";
import { UserData, InitConfig, InitCommand, InitFile, ConfigSetProps } from "monocdk/aws-ec2";
import { AutoScalingGroup } from "monocdk/aws-autoscaling";
import { DeploymentStack } from "@amzn/pipelines";
import { runPathRecipeSync } from '@amzn/brazil'
import * as fs from "fs";

const SCRIPT_BASE_DIR = '/opt/amazon/scripts';

export function getChronicleScriptPath(): string {
   const chroniclePkgPath = runPathRecipeSync('[ChronicleInstaller]pkg.runtimefarm')
   return `${chroniclePkgPath}/usr/Chronicle/install_chronicled.py`;
}

export function getSinglePassBootstrapScript(): string {
   const singlePassPkgPath = runPathRecipeSync('[SinglePassEC2CloudFormationScript]pkg.runtimefarm');
   return `${singlePassPkgPath}/usr/singlepass/prod.sh`;
}

function getHostclassName() {
    return 'AWS-GURU-DETECTOR';
}

export function installChronicleAgentScript(stack: DeploymentStack) {
    const installChronicleAgentScript = new Asset(stack, 'ChronicleScript', {
        path: `${getChronicleScriptPath()}`
    });
    return installChronicleAgentScript;
}

export function installSinglePassBootstrapScript(stack: DeploymentStack) {
    const installSinglePassBootstrapScript = new Asset(stack, 'SinglePassScript', {
        path: `${getSinglePassBootstrapScript()}`
    });
    return installSinglePassBootstrapScript;
}

export function cfnInitConfigSetProps(): ConfigSetProps {
   return {
       configSets: { 'default': ['InstallChronicled', 'SetupSinglePass'] },
       configs: {
          'InstallChronicled': getInstallChronicledConfig(),
          'SetupSinglePass': getSetupSinglePassConfig()
       }
   }
}

export function getInstallChronicledConfig() {
    let patchInitConfig = new InitConfig([
      InitCommand.shellCommand(`${SCRIPT_BASE_DIR}/install_chronicled.py`),
      InitCommand.shellCommand(`echo '${getHostclassName()}' > /etc/hostclass`),
    ]);

    // Include install_chronicled.py script specified in the InitConfig.
    let installChronicledFileContent: string =
      fs.readFileSync(`${runPathRecipeSync('[ChronicleInstaller]pkg.runtimefarm')}/usr/Chronicle/install_chronicled.py`, {encoding: 'utf-8'})
    patchInitConfig.add(InitFile.fromString(`${SCRIPT_BASE_DIR}/install_chronicled.py`, installChronicledFileContent, {
      mode: '000755',
      owner: 'root',
      group: 'root'
    }))

    return patchInitConfig;
  }

export function getSetupSinglePassConfig() {
    let patchInitConfig = new InitConfig([
      InitCommand.shellCommand(`${SCRIPT_BASE_DIR}/singlepass-prod.sh`),
    ]);

    // Include singlepass-prod.sh script specified in the InitConfig.
    let singlePassScriptContent: string =
      fs.readFileSync(`${runPathRecipeSync('[SinglePassEC2CloudFormationScript]pkg.runtimefarm')}/usr/singlepass/prod.sh`, {encoding: 'utf-8'})
    patchInitConfig.add(InitFile.fromString(`${SCRIPT_BASE_DIR}/singlepass-prod.sh`, singlePassScriptContent, {
      mode: '000755',
      owner: 'root',
      group: 'root'
    }))
    return patchInitConfig;
  }

//as per https://w.amazon.com/bin/view/Chronicle/Onboarding/EC2Instance/
export function installChronicleForASG(stack: DeploymentStack,
                                       asg: AutoScalingGroup,
                                       chronicleAgentScript: Asset,
                                       singlePassBootstrapScript: Asset) {

    //https://w.amazon.com/bin/view/SPIE/Onboarding/#HPart2:SetUpYourEC2Instances
    asg.addUserData(
        "yum install -y aws-cli",
        "yum install -y wget",
        `aws s3 cp ${chronicleAgentScript.s3ObjectUrl} /tmp/chronicle.py`,
        "python /tmp/chronicle.py",
        `echo '${getHostclassName()}' > /etc/hostclass`,
        `aws s3 cp ${singlePassBootstrapScript.s3ObjectUrl} /tmp/bootstrap_singlepass.sh`,
        "/bin/bash /tmp/bootstrap_singlepass.sh"
    );

    // Allow instance to grab the Chronicle Script S3 Asset
    asg.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
           's3:GetObject',
           's3:ListBucket'
        ],
        resources: [
             `${stack.deploymentEnvironment.barsEnvironment.bucketArn}/${chronicleAgentScript.s3ObjectKey}`,
             `${stack.deploymentEnvironment.barsEnvironment.bucketArn}/*`,
             `${stack.deploymentEnvironment.barsEnvironment.bucketArn}`,
        ]
    }))

    // Required to read from the bucket that stores the Chronicle Script
    asg.addToRolePolicy(new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
             'kms:Decrypt'
        ],
        resources: [
             `${stack.deploymentEnvironment.barsEnvironment.kmsImportedKeyArn}`
        ]
    }))
}