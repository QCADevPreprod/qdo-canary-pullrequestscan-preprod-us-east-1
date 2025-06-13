import {DeploymentEnvironmentFactory} from '@amzn/pipelines';

export const account = '01234567890';
export const region = 'us-west-2';
export const disambiguator = 'DragonGlassDetector';
export const stage = 'beta';
export const createCacheTable = true;
export const prefix = 'AWSGuruDetectorRulesEngine';

export const env = DeploymentEnvironmentFactory.fromAccountAndRegion(account, region, disambiguator);
