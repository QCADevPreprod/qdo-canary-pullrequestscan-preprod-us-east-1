const AWSXRay = require('aws-xray-sdk-core')
const aws = AWSXRay.captureAWS(require('aws-sdk'))
AWSXRay.captureHTTPsGlobal(require('http'))
AWSXRay.captureHTTPsGlobal(require('https'))
const axios = require('axios')
const region = process.env.AWS_REGION
const COMPONENT_API = process.env.CompAPI
const tableName = process.env.ddbTableName
const ddb = new aws.DynamoDB({ apiVersion: 'latest' })
let l1InputData

// Function to get APIToken from Secrets Manager
const getApiToken = async () => {
    const secretsmanager = new aws.SecretsManager({ region: region })
    const secret = await secretsmanager.getSecretValue({ SecretId: 'gd2020-AutApiToken' }).promise()
    return secret.SecretString
}
const headers = async () => {
        const response = {
        'Authorization': 'Bearer ' + await getApiToken(),
        'Content-Type': 'application/json',
        'Accept': 'applcation/json'
    }
    return response
}

// Read Current Input from Component API
const getTeamInput = async (teamId, inputKey) => {
    console.log(`Inside getTeamInput() \n${teamId} \n${inputKey}`)
    try {
        const response = await axios({
            method: 'get',
            url: `${COMPONENT_API}teams/${teamId}/components/mod/inputs/${inputKey}`,
            headers: await headers()
            })
            console.log(`TeamInput: ${response.data.data} <----> ${teamId}`)
            return response.data.data
    } catch (err) {
            console.log(`Something went wrong with getTeamInput() call, Error: ${err.response.data}`)
            console.log(err.response.data)
            return err.response.data.Code
        }
    }
// Function to check endpoint availability
const checkAvailability = async (teamId, inputKey) => {
    console.log(`Inside checkAvailability() \nTeamID: ${teamId} \nInputKey: ${inputKey}`)
    l1InputData = await getTeamInput(teamId, 'L1Input')
    console.log(`InputData: ${l1InputData}`)
    if (l1InputData != null) {
                try {
                const response = await axios({
                    method: 'get',
                    timeout: 1000,
                    url: `http://${l1InputData}:8080/web-customer-tracker/api/health`
                })
                const availability = response.status === 200 && response.data[0][1].includes('.internal') ? true : false
                return availability
            } catch (err)  {
                if (err.response) {
                    console.log('Something went wrong with checkAvailability() call')
                    console.log(err.response.data)
                    console.log(err.response.status)
                    console.log(err.response.headers)
                    return false
                } else if (err.request) {
                    console.log('Something wrong with the checkAvailability() request')
                    console.log(err.request)
                    return false
                } else {
                    console.log('Is it here ---')
                    console.log('Error', err.message)
                    return false
                }
            }
            } else {
                return false
            }
}
// Function to AssumeRole into Team account
const getAssumeRoleCreds = async (params) => {
    console.log('Inside getAssumeRoleCreds()')

    const sts = new aws.STS({
        apiVersion: 'latest',
        stsRegionalEndpoints: 'regional'
                })
    try {
        const response = await sts.assumeRole(params).promise()
        const creds = {
            accessKeyId: response.Credentials.AccessKeyId,
            secretAccessKey: response.Credentials.SecretAccessKey,
            sessionToken: response.Credentials.SessionToken
            }
            return creds
        } catch (err) {
            console.log(`assumeRole() call failed, ErrorCode: ${err.code}`)
            return err.code
        }
}
// Function to get MOD Gym AMI ID from Master Account
const getLocalAmiId = async () => {
    console.log('Inside getLocalAmiId()')

    const ec2 = new aws.EC2({ apiVersion: 'latest' })
    const params = {
        Filters: [
            {
                Name: "name",
                Values: ['mod-java-ami']
            }]
        }
    try {
        const response = await ec2.describeImages(params).promise()
        return response.Images[0].ImageId
    } catch (err) {
    console.log(`describeImages() call failed, ErrorCode: ${err.code}`)
    return err.code
}
}
// Function to get Team AMI ID from Team Account
const getTeamEC2Instance = async (opsRoleARN, localImageId) => {
    console.log(`\nInside getTeamEC2Instance() \n${opsRoleARN} \n${localImageId}`)
    try {
        const options = {
            RoleArn: opsRoleARN,
            RoleSessionName: 'Mod-Eval-Role-Assume',
            DurationSeconds: 900
        }
        const params = {
            Filters: [
                {
                    Name: 'image-id',
                    Values: [
                        `${localImageId}`]
                }]
        }
        const ec2 = new aws.EC2(await getAssumeRoleCreds(options))
        const response = await ec2.describeInstances(params).promise()
        if (!response.Reservations || !response.Reservations.length) {
            return 'EC2 Resource Not Found'
        } else {
            console.log(response.Reservations)
            const ec2Instance = response.Reservations.filter((ec2, index) => {
                return ec2.Instances.every(i => i.State.Name === 'running' && i.PublicIpAddress === l1InputData)
            })
            console.log('----Printing EC2 Instance from Team Account ----')
            console.log(ec2Instance[0].Instances[0])
            return ec2Instance[0].Instances[0]
        }
        
    } catch (err) {
        console.log(`describeInstances() call failed, ErrorCode: ${err}`)
        return err.code
    }
}


exports.handler = async (event) => {
    const teamId = event.teamId
    const teamName = event.teamName
    const opsRoleARN = event.opsRoleARN
    const accountId = event.accountId
    console.log(`---- Start Evaluation ---- \nTeamName: ${teamName} \nTeamID: ${teamId} opsRoleARN: \n${opsRoleARN} AccountID: \n${accountId}`)

    const isAvailable = await checkAvailability(teamId, 'L1Input')
    const localImageId = await getLocalAmiId()
    const teamEC2Instance = await getTeamEC2Instance(opsRoleARN, localImageId)
    const teamImageId = teamEC2Instance === undefined ? false : teamEC2Instance.ImageId
    const resourcePresent = () => {
        if (teamEC2Instance === 'EC2 Resource Not Found' || teamEC2Instance === 'undefined') {
            return false
        } else if (teamImageId === localImageId) {
            return true
        } else {
            return false
            }
                }
    const secGrpPresent = () => {
                    if (teamEC2Instance === 'EC2 Resource Not Found' || teamEC2Instance === undefined) {
                        return 'Resource Not Found'
                    } else if (!teamEC2Instance.SecurityGroups || !teamEC2Instance.SecurityGroups.length) {
                        return 'Resource Not Found'
                    } else {
                        return teamEC2Instance.SecurityGroups[0].GroupName
                    }
                }
                const payload = {
                    availability: isAvailable,
                    isResourcePresent: resourcePresent(),
                    teamInstanceType: teamEC2Instance === 'EC2 Resource Not Found' || teamEC2Instance === undefined ? 'Resource Not Found' : teamEC2Instance.InstanceType,
                    teamSecGrp: secGrpPresent()
                }
                console.log('----- Send Payload to Step Functions ----')
                console.log(payload)
                return payload
}