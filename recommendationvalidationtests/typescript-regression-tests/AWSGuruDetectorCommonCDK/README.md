## Welcome!

This is a common CDK package managed and used by AWS CodeGuru Reviewer team for detector resources. The package consists of common CDK constructs
that can be re-used in service specific infrastructure packages.

## Installation
Use NpmPrettyMuch to install this package:

Add ``AWSGuruDetectorCommonCDK`` to dependencies in your Brazil Config file
Add ```"@amzn/aws_guru_detector_common_cdk": "*"``` to dependencies in your package.json
Run ``brazil-build`` to install this package in your target package

## Development in this package

* Make changes in the CommonCDK package and build it.
* Remember to export whatever you have created in ``app.ts`` . If you don't do it , you won't be able to use it.
* Go to your main service package where you are using this Common package and ``delete its node modules``
* Run ``brazil-build clean && brazil-build release`` to re-install the dependency.
* Also can explore other options of using npm link / brazil-build link

## Useful links:
* https://builderhub.corp.amazon.com/docs/native-aws/developer-guide/cdk-pipeline.html
* https://code.amazon.com/packages/BONESConstructs/blobs/HEAD/--/packages/@amzn/pipelines/README.md
* https://code.amazon.com/packages/CDKBuild/blobs/HEAD/--/README.md