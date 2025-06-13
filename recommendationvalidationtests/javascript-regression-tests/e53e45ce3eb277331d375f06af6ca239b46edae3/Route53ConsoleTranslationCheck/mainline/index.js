#!/usr/bin/env node

import _ from "lodash";
import path from "path";
import process from "process";
import fs from "fs";
const signale = require('signale')
import git from "isomorphic-git";
import chalk from "chalk";

import _yargs from "yargs";

const yargs = _yargs(process.argv.slice(2));

const getJSONAtCommit = async (path, commitId) => {
    const commitOid = await git.resolveRef({
        fs,
        dir: process.cwd(),
        ref: commitId,
    });

    let { blob } = await git.readBlob({
        fs,
        dir: process.cwd(),
        oid: commitOid,
        filepath: path,
    });

    return JSON.parse(Buffer.from(blob).toString("utf8"));
};

const generateFlattenObj = (obj, prefix = "") => {
    let output = {};

    for (const key in obj) {
        if (typeof obj[key] === "object") {
            const flattenedObj = generateFlattenObj(obj[key], prefix + key + ".");

            output = { ...output, ...flattenedObj };
        } else {
            output[prefix + key] = obj[key];
        }
    }

    return output;
};

const getJSONFileDiffReport = async (
    baseCommit,
    tipCommit,
    basePath,
    filename
) => {
    const baseObj = generateFlattenObj(
        await getJSONAtCommit([basePath, filename].join("/"), baseCommit)
    );

    const tipObj = generateFlattenObj(
        await getJSONAtCommit([basePath, filename].join("/"), tipCommit)
    );

    const added = _.difference(Object.keys(tipObj), Object.keys(baseObj));
    const removed = _.difference(Object.keys(baseObj), Object.keys(tipObj));

    const modified = [];
    for (const key in baseObj) {
        if (baseObj[key] !== tipObj[key] && tipObj[key] !== undefined) {
            modified.push(key);
        }
    }

    return {
        added,
        removed,
        modified,
    };
};

const strictDiffI18n = async (basePath, base, baseId, tipId, verbose) => {
    const baseReport = await getJSONFileDiffReport(baseId, tipId, basePath, base);

    const filenames = fs
        .readdirSync(basePath)
        .filter((filename) => filename.match(/.json$/) && filename !== base);

    let errorCount = 0;

    for (const filename of filenames) {
        const diffReport = await getJSONFileDiffReport(
            baseId,
            tipId,
            basePath,
            filename
        );

        const filenameLog = new signale.Signale({
            scope: filename,
        });

        const addedMissing = _.difference(baseReport.added, diffReport.added);
        const removedMissing = _.difference(baseReport.removed, diffReport.removed);
        const modifiedMissing = _.difference(
            baseReport.modified,
            diffReport.modified
        );

        if (addedMissing.length > 0) {
            filenameLog.fatal(
                addedMissing.length +
                (addedMissing.length !== 1 ? " keys added in " : " key added in ") +
                chalk.blue(base) +
                " but not in " +
                chalk.blue(filename)
            );

            if (verbose) {
                for (const key of addedMissing) {
                    console.log(
                        chalk.dim("› ") +
                        chalk.green(key) +
                        " added in " +
                        chalk.blue(base) +
                        " but not in " +
                        chalk.blue(filename)
                    );
                }
            }

            errorCount += 1;
        }

        if (modifiedMissing.length > 0) {
            filenameLog.fatal(
                modifiedMissing.length +
                (modifiedMissing.length !== 1
                    ? " keys modified in "
                    : " key modified in ") +
                chalk.blue(base) +
                " but not in " +
                chalk.blue(filename)
            );

            if (verbose) {
                for (const key of modifiedMissing) {
                    console.log(
                        chalk.dim("› ") +
                        chalk.green(key) +
                        " modified in " +
                        chalk.blue(base) +
                        " but not in " +
                        chalk.blue(filename)
                    );
                }
            }

            errorCount += 1;
        }

        if (removedMissing.length > 0) {
            filenameLog.warn(
                removedMissing.length +
                (removedMissing.length !== 1
                    ? " keys removed in "
                    : " key removed in ") +
                chalk.blue(base) +
                " but not in " +
                chalk.blue(filename)
            );

            if (verbose) {
                for (const key of removedMissing) {
                    console.log(
                        chalk.dim("› ") +
                        chalk.green(key) +
                        " removed in " +
                        chalk.blue(base) +
                        " but not in " +
                        chalk.blue(filename)
                    );
                }
            }
        }
    }

    return errorCount;
};

const main = async (args) => {
    signale.info(
        "Comparing between " +
        chalk.green(args.commit) +
        " and " +
        chalk.green(args.tip)
    );

    const errorCount = await strictDiffI18n(
        args.path,
        args.base,
        args.commit,
        args.tip,
        args.verbose
    );

    if (errorCount > 0) {
        yargs.exit(1);
    }
};

const argv = yargs
    .usage("Verify if all i18n files are in sync")
    .options({
        commit: {
            description:
                "Base commit to compare translations against, usually the current deployed commit",
            demandOption: true,
            alias: "c",
        },
        path: {
            description: "Path to i18n folder",
            demandOption: true,
            alias: "p",
        },
        base: {
            description: "Truth file for i18n translation",
            demandOption: false,
            alias: "b",
            default: "en.json",
        },
        tip: {
            description: "Commit to use as most recent commit",
            demandOption: false,
            alias: "t",
            default: "HEAD",
        },
        verbose: {
            description: "Display a detailed report",
            demandOption: false,
            alias: "v",
            default: false,
        },
    })
    .boolean(["v"])
    .help("help")
    .strict()
    .showHelpOnFail().argv;

main(argv);
