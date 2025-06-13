export function getLambdaInsightsLayerArn(region: string): string {
    return `arn:aws:lambda:${region}:580247275435:layer:LambdaInsightsExtension:2`;
}