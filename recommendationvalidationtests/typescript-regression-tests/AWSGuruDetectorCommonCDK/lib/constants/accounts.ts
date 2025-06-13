import {DetectorType} from "../model/detector_type";

export const ARTIFACT_BUILDER_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '124964525120'
    },
    'beta': {
        'us-west-2': '908976537451'
    },
    'prod-artifactbuilder': {
        'us-west-2': '640349498435'
    }
};

// account for detector hosting: it contains shared lambdas and step function to generate recommendations
export const DETECTOR_HOSTING_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '725374823231'
    },
    'beta': {
        'us-west-2': '958321698592'
    },
    'gamma': {
        'us-east-1': '525743131049',
        'us-west-2': '200796578965',
    },
    'prod-regression': {
        'us-west-2': '443717077896'
    },
    'preprod': {
        'eu-north-1': '204486389177',
        'us-east-2': '326257892997',
        'eu-west-1': '458759821744',
        'eu-central-1': '631049933788',
        'us-east-1': '258230640563',
        'eu-west-2': '589424193562',
        'ap-northeast-1': '660319838206',
        'us-west-2': '674460270750',
        'ap-southeast-1': '459656494460',
        'ap-southeast-2': '375378455638'
    },
    'prod': {
        'us-west-2': '933665147898',
        'eu-north-1': '875204831547',
        'us-east-2': '412512556686',
        'eu-west-1': '956849272763',
        'eu-central-1': '548562529135',
        'us-east-1': '727128931044',
        'eu-west-2': '865084220668',
        'ap-northeast-1': '480664128564',
        'ap-southeast-1': '180766937847',
        'ap-southeast-2': '907178448944'
    },
    'prod-artifactbuilder': {
        'us-west-2': '443717077896'
    }
};

// accounts for sagemaker models (account prefix with aws-guru+models)
export const SAGEMAKER_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '442475053577'
    },
    'beta': {
        'us-west-2': '442475053577'
    },
    'gamma': {
        'us-east-1': '832082512328',
        'us-west-2': '312659533665'
    },
    'prod-regression': {
        'us-west-2': '885641652102'
    },
    'preprod': {
        'eu-north-1': '560955623292',
        'us-east-2': '382110549012',
        'eu-west-1': '271571310077',
        'eu-central-1': '569645443139',
        'us-east-1': '982155298736',
        'eu-west-2': '070599102337',
        'ap-northeast-1': '873351605080',
        'us-west-2': '070688689742',
        'ap-southeast-1': '238206694959',
        'ap-southeast-2': '865475801127'
    },
    'prod': {
        'eu-north-1': '589754042036',
        'us-east-2': '322241605319',
        'eu-west-1': '408814456570',
        'eu-central-1': '306833713199',
        'us-east-1': '400992441418',
        'eu-west-2': '325700700525',
        'ap-northeast-1': '153614928310',
        'us-west-2': '636037667477',
        'ap-southeast-1': '079821132810',
        'ap-southeast-2': '366630173827'
    },
    'prod-artifactbuilder': {
        'us-west-2': '885641652102'
    }
};

// account for dragon glass detectors (account prefix with aws-guru+detector-dragonglass)
export const DRAGON_GLASS_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '111727076607'
    },
    'beta': {
        'us-west-2': '120195444701'
    },
    'gamma': {
        'us-east-1': '663652041254',
        'us-west-2': '327821428115'
    },
    'prod-regression': {
        'us-west-2': '407240312627'
    },
    'preprod': {
        'eu-north-1': '596117585098',
        'us-east-2': '341193731594',
        'eu-west-1': '252307677973',
        'eu-central-1': '273008154558',
        'us-east-1': '127028484649',
        'eu-west-2': '065334065705',
        'ap-northeast-1': '982707541093',
        'us-west-2': '871510782905',
        'ap-southeast-1': '657103930781',
        'ap-southeast-2': '170677285094'
    },
    'prod': {
        'eu-north-1': '632693560474',
        'us-east-2': '508684448903',
        'eu-west-1': '053482014879',
        'eu-central-1': '427396220839',
        'us-east-1': '469003841093',
        'eu-west-2': '122375081148',
        'ap-northeast-1': '549730313078',
        'us-west-2': '726610467568',
        'ap-southeast-1': '285209233695',
        'ap-southeast-2': '482648784546'
    },
    'prod-artifactbuilder': {
        'us-west-2': '574879146812'
    }
};

// account for inconsistency detectors (account prefix with aws-guru+detector-inconsistency)
export const INCONSISTENCY_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '664505669464'
    },
    'beta': {
        'us-west-2': '004423861375'
    },
    'gamma': {
        'us-east-1': '574905904659',
        'us-west-2': '025462420335'
    },
    'prod-regression': {
        'us-west-2': '239004203613'
    },
    'preprod': {
        'eu-north-1': '983872902243',
        'us-east-2': '766448366806',
        'eu-west-1': '539746068549',
        'eu-central-1': '125581912130',
        'us-east-1': '317170311843',
        'eu-west-2': '197207411861',
        'ap-northeast-1': '417916443524',
        'us-west-2': '832107366603',
        'ap-southeast-1': '825566408097',
        'ap-southeast-2': '011790014419'
    },
    'prod': {
        'eu-north-1': '586109975094',
        'us-east-2': '793451903997',
        'eu-west-1': '835209460875',
        'eu-central-1': '219842813146',
        'us-east-1': '324902846457',
        'eu-west-2': '097399590914',
        'ap-northeast-1': '270465357275',
        'us-west-2': '349243484805',
        'ap-southeast-1': '586440829544',
        'ap-southeast-2': '028152764808'
    },
    'prod-artifactbuilder': {
        'us-west-2': '239004203613'
    }
};

// accounts for infer detectors (account prefix with aws-guru+detector-infer)
export const INFER_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '198876662311'
    },
    'beta': {
        'us-west-2': '623064376366'
    },
    'gamma': {
        'us-east-1': '297799445040',
        'us-west-2': '386859617859'
    },
    'prod-regression': {
        'us-west-2': '400646584551'
    },
    'preprod': {
        'eu-north-1': '815296810691',
        'us-east-2': '474156575901',
        'eu-west-1': '469278219343',
        'eu-central-1': '544374380035',
        'us-east-1': '224557286855',
        'eu-west-2': '290326124867',
        'ap-northeast-1': '710435317788',
        'us-west-2': '981368885551',
        'ap-southeast-1': '863514853567',
        'ap-southeast-2': '782288905737'
    },
    'prod': {
        'eu-north-1': '642492652019',
        'us-east-2': '364758556720',
        'eu-west-1': '065190498905',
        'eu-central-1': '676015728209',
        'us-east-1': '635967863865',
        'eu-west-2': '927582195619',
        'ap-northeast-1': '965437541815',
        'us-west-2': '862079287573',
        'ap-southeast-1': '434867881632',
        'ap-southeast-2': '317671476984'
    },
    'prod-artifactbuilder': {
        'us-west-2': '194348369527'
    }
};

// accounts for bandit detectors (account prefix with aws-guru+detector-bandit)
export const BANDIT_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '553932632498'
    },
    'beta': {
        'us-west-2': '523222142518'
    },
    'gamma': {
        'us-east-1': '598508603314',
        'us-west-2': '727855765006'
    },
    'prod-regression': {
        'us-west-2': '841256135468'
    },
    'preprod': {
        'eu-north-1': '305637223349',
        'us-east-2': '065239514393',
        'eu-west-1': '132600587605',
        'eu-central-1': '425281330526',
        'us-east-1': '557488716126',
        'eu-west-2': '910397076040',
        'ap-northeast-1': '907584252867',
        'us-west-2': '167105566172',
        'ap-southeast-1': '902221017216',
        'ap-southeast-2': '277150816118'
    },
    'prod': {
        'eu-north-1': '676601904769',
        'us-east-2': '311446270054',
        'eu-west-1': '411514375889',
        'eu-central-1': '740213675674',
        'us-east-1': '199683625262',
        'eu-west-2': '413821032586',
        'ap-northeast-1': '426148030987',
        'us-west-2': '539810890567',
        'ap-southeast-1': '419145893668',
        'ap-southeast-2': '220522851771'
    },
    'prod-artifactbuilder': {
        'us-west-2': '841256135468'
    }
};

// accounts for rulesengine detectors (account prefix with aws-guru+detector-rulesengine)
export const RULESENGINE_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

// accounts for rulesengine CDO detectors (account prefix with aws-guru+detector-rulesengine)
export const RULESENGINECDO_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'us-west-2': '191919581801'
    },
    'prod': {
        'us-west-2': '376891811769',
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};


// accounts for input validation task
export const INPUT_VALIDATION_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

// account for partitioning task
export const PARTITIONING_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

// account for dragonstone detectors
export const DRAGONSTONE_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '111727076607'
    },
    'beta': {
        'us-west-2': '120195444701'
    },
    'gamma': {
        'us-east-1': '663652041254',
        'us-west-2': '327821428115'
    },
    'prod-regression': {
        'us-west-2': '407240312627'
    },
    'preprod': {
        'eu-north-1': '596117585098',
        'us-east-2': '341193731594',
        'eu-west-1': '252307677973',
        'eu-central-1': '273008154558',
        'us-east-1': '127028484649',
        'eu-west-2': '065334065705',
        'ap-northeast-1': '982707541093',
        'us-west-2': '871510782905',
        'ap-southeast-1': '657103930781',
        'ap-southeast-2': '170677285094'
    },
    'prod': {
        'eu-north-1': '632693560474',
        'us-east-2': '508684448903',
        'eu-west-1': '053482014879',
        'eu-central-1': '427396220839',
        'us-east-1': '469003841093',
        'eu-west-2': '122375081148',
        'ap-northeast-1': '549730313078',
        'us-west-2': '726610467568',
        'ap-southeast-1': '285209233695',
        'ap-southeast-2': '482648784546'
    },
    'prod-artifactbuilder': {
        'us-west-2': '574879146812'
    }
};

// account for byte code decompilation task(re-use the same aws account for dragonglass detector)
export const BYTE_CODE_DECOMPILATION_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '111727076607'
    },
    'beta': {
        'us-west-2': '120195444701'
    },
    'gamma': {
        'us-east-1': '663652041254',
        'us-west-2': '327821428115'
    },
    'prod-regression': {
        'us-west-2': '574879146812'
    },
    'preprod': {
        'eu-north-1': '596117585098',
        'us-east-2': '341193731594',
        'eu-west-1': '252307677973',
        'eu-central-1': '273008154558',
        'us-east-1': '127028484649',
        'eu-west-2': '065334065705',
        'ap-northeast-1': '982707541093',
        'us-west-2': '871510782905',
        'ap-southeast-1': '657103930781',
        'ap-southeast-2': '170677285094'
    },
    'prod': {
        'eu-north-1': '632693560474',
        'us-east-2': '508684448903',
        'eu-west-1': '053482014879',
        'eu-central-1': '427396220839',
        'us-east-1': '469003841093',
        'eu-west-2': '122375081148',
        'ap-northeast-1': '549730313078',
        'us-west-2': '726610467568',
        'ap-southeast-1': '285209233695',
        'ap-southeast-2': '482648784546'
    },
    'prod-artifactbuilder': {
        'us-west-2': '574879146812'
    }
};

// accounts for IR extraction task (re-use the same aws account for rulesengine detector)
export const IR_EXTRACTION_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

// accounts for HardCodedSecret detectors (re-use the same aws accounts for rulesengine detector)
export const HARDCODED_SECRETS_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

// accounts for Penrose detectors (re-use the same aws accounts for rulesengine detector)
export const PENROSE_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '025902225897'
    },
    'beta': {
        'us-west-2': '111962246506'
    },
    'gamma': {
        'us-east-1': '152738380192',
        'us-west-2': '197526688391'
    },
    'prod-regression': {
        'us-west-2': '222777679285'
    },
    'preprod': {
        'eu-north-1': '051928382295',
        'us-east-2': '713998250924',
        'eu-west-1': '404382764911',
        'eu-central-1': '037426146956',
        'us-east-1': '120443188761',
        'eu-west-2': '876589184794',
        'ap-northeast-1': '299993222462',
        'us-west-2': '191919581801',
        'ap-southeast-1': '665499995833',
        'ap-southeast-2': '154774000406'
    },
    'prod': {
        'eu-north-1': '029354885387',
        'us-east-2': '778243028668',
        'eu-west-1': '540612949264',
        'eu-central-1': '345624762930',
        'us-east-1': '311384024313',
        'eu-west-2': '622008272290',
        'ap-northeast-1': '426971430571',
        'us-west-2': '376891811769',
        'ap-southeast-1': '991534923499',
        'ap-southeast-2': '335559176264'
    },
    'prod-artifactbuilder': {
        'us-west-2': '431605236618'
    }
};

export const CODE_REMEDIATION_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '664505669464'
    },
    'beta': {
        'us-west-2': '004423861375'
    },
    'gamma': {
        'us-east-1': '574905904659',
        'us-west-2': '025462420335'
    },
    'prod-regression': {
        'us-west-2': '936237351984'
    },
    'preprod': {
        'eu-north-1': '983872902243',
        'us-east-2': '766448366806',
        'eu-west-1': '539746068549',
        'eu-central-1': '125581912130',
        'us-east-1': '317170311843',
        'eu-west-2': '197207411861',
        'ap-northeast-1': '417916443524',
        'us-west-2': '832107366603',
        'ap-southeast-1': '825566408097',
        'ap-southeast-2': '011790014419'
    },
    'prod': {
        'eu-north-1': '586109975094',
        'us-east-2': '793451903997',
        'eu-west-1': '835209460875',
        'eu-central-1': '219842813146',
        'us-east-1': '324902846457',
        'eu-west-2': '097399590914',
        'ap-northeast-1': '270465357275',
        'us-west-2': '349243484805',
        'ap-southeast-1': '586440829544',
        'ap-southeast-2': '028152764808'
    },
    'prod-artifactbuilder': {
        'us-west-2': '239004203613'
    }
};

export const DETECTOR_LLM_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '664505669464'
    },
    'beta': {
        'us-west-2': '004423861375'
    },
    'gamma': {
        'us-east-1': '574905904659',
        'us-west-2': '025462420335'
    },
    'prod-regression': {
        'us-west-2': '936237351984'
    },
    'preprod': {
        'eu-north-1': '983872902243',
        'us-east-2': '766448366806',
        'eu-west-1': '539746068549',
        'eu-central-1': '125581912130',
        'us-east-1': '317170311843',
        'eu-west-2': '197207411861',
        'ap-northeast-1': '417916443524',
        'us-west-2': '832107366603',
        'ap-southeast-1': '825566408097',
        'ap-southeast-2': '011790014419'
    },
    'prod': {
        'eu-north-1': '586109975094',
        'us-east-2': '793451903997',
        'eu-west-1': '835209460875',
        'eu-central-1': '219842813146',
        'us-east-1': '324902846457',
        'eu-west-2': '097399590914',
        'ap-northeast-1': '270465357275',
        'us-west-2': '349243484805',
        'ap-southeast-1': '586440829544',
        'ap-southeast-2': '028152764808'
    },
    'prod-artifactbuilder': {
        'us-west-2': '239004203613'
    }
};


export const LLM_ACCOUNTS: { [stage: string]: { [region: string]: string } } = {
    'alpha': {
        'us-west-2': '664505669464'
    },
    'beta': {
        'us-west-2': '004423861375'
    },
    'gamma': {
        'us-east-1': '574905904659',
        'us-west-2': '025462420335'
    },
    'prod-regression': {
        'us-west-2': '936237351984'
    },
    'preprod': {
        'eu-north-1': '983872902243',
        'us-east-2': '766448366806',
        'eu-west-1': '539746068549',
        'eu-central-1': '125581912130',
        'us-east-1': '317170311843',
        'eu-west-2': '197207411861',
        'ap-northeast-1': '417916443524',
        'us-west-2': '832107366603',
        'ap-southeast-1': '825566408097',
        'ap-southeast-2': '011790014419'
    },
    'prod': {
        'eu-north-1': '586109975094',
        'us-east-2': '793451903997',
        'eu-west-1': '835209460875',
        'eu-central-1': '219842813146',
        'us-east-1': '324902846457',
        'eu-west-2': '097399590914',
        'ap-northeast-1': '270465357275',
        'us-west-2': '349243484805',
        'ap-southeast-1': '586440829544',
        'ap-southeast-2': '028152764808'
    },
    'prod-artifactbuilder': {
        'us-west-2': '239004203613'
    }
};

export function getTaskInputQueue(detectorType: DetectorType): string {
    switch (detectorType) {
        case DetectorType.Bandit:
        case DetectorType.DragonGlass:
        case DetectorType.Inconsistency:
        case DetectorType.Infer:
        case DetectorType.RulesEngine:
            return "TaskInputQueue";
        case DetectorType.RulesEngineCDO:
            return "AWSGuruDetectorRulesEngineCDOTaskInputQueue";
        case DetectorType.InputValidation:
            return "AWSGuruInputValidationTaskTaskInputQueue";
        case DetectorType.Partitioning:
            return "AWSGuruCodePartitioningTaskTaskInputQueue";
        case DetectorType.DragonStone:
            return "AWSGuruDetectorDragonStoneTaskInputQueue";
        case DetectorType.ByteCodeDecompilation:
            return "AWSGuruByteCodeDecompilationTaskTaskInputQueue";
        case DetectorType.IRExtraction:
            return "AWSGuruIRExtractionTaskTaskInputQueue";
        case DetectorType.HardCodedSecrets:
            return "AWSGuruDetectorHardCodedSecretsTaskInputQueue";
        case DetectorType.Penrose:
            return "AWSGuruDetectorPenroseTaskInputQueue";
        case DetectorType.CodeRemediation:
            return "AWSGuruCodeRemediationTaskTaskInputQueue";
        case DetectorType.LLM:
            return "AWSGuruDetectorLLMTaskInputQueue";
        default:
            throw new Error("Unsupported detector type " + detectorType);
    }
}

export function getDetectorAccountId(detectorType: DetectorType,
                                 stage: string,
                                 region: string): string {
    switch (detectorType) {
        case DetectorType.Bandit:
            return BANDIT_ACCOUNTS[stage][region];
        case DetectorType.DragonGlass:
            return DRAGON_GLASS_ACCOUNTS[stage][region];
        case DetectorType.Inconsistency:
            return INCONSISTENCY_ACCOUNTS[stage][region];
        case DetectorType.Infer:
            return INFER_ACCOUNTS[stage][region];
        case DetectorType.RulesEngine:
            return RULESENGINE_ACCOUNTS[stage][region];
        case DetectorType.RulesEngineCDO:
            return RULESENGINECDO_ACCOUNTS[stage][region];
        case DetectorType.InputValidation:
            return INPUT_VALIDATION_ACCOUNTS[stage][region];
        case DetectorType.Partitioning:
            return PARTITIONING_ACCOUNTS[stage][region];
        case DetectorType.DragonStone:
            return DRAGONSTONE_ACCOUNTS[stage][region];
        case DetectorType.ByteCodeDecompilation:
            return BYTE_CODE_DECOMPILATION_ACCOUNTS[stage][region];
        case DetectorType.IRExtraction:
            return IR_EXTRACTION_ACCOUNTS[stage][region];
        case DetectorType.HardCodedSecrets:
            return HARDCODED_SECRETS_ACCOUNTS[stage][region];
        case DetectorType.Penrose:
            return PENROSE_ACCOUNTS[stage][region];
        case DetectorType.CodeRemediation:
            return CODE_REMEDIATION_ACCOUNTS[stage][region];
        case DetectorType.LLM:
            return DETECTOR_LLM_ACCOUNTS[stage][region];

        default:
            throw new Error("Unsupported detector type" + detectorType);
    }
}