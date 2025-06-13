import { BrazilPackage } from "@amzn/pipelines";

export const autoBuildPackages = [
    BrazilPackage.fromProps({
        name: "AWSGuruDetectorCommonCDK",
        branch: "mainline-1.1",
    }),
    BrazilPackage.fromProps({
        name: "AWSGuruDetectorTask",
        branch: "mainline",
    }),
];
