#!/usr/bin/env node
/* eslint-disable */
"use strict";

const cli = require("cac")();
const chalk = require("chalk");
const clear = require("clear");

const { rootLogger } = require("ts-jest");
const {
  configuration,
  Install,
  Check,
  Update,
} = require("../dist/main.umd.js");
const { version } = require("../package.json");

clear();
console.log(" ");
console.log(chalk.redBright.bold("IMPORTANT:"));
console.log(chalk.redBright.bold("The package was moved to"));
console.log("https://www.npmjs.com/package/@deven-org/documentation-skeleton");
console.log(chalk.redBright.bold("This package will not receive any further updates, please switch to the new one linked above."))
console.log(" ");
console.log(chalk.white.bold("deven-doc-install:"));
console.log(" ");
cli
  .command(
    "install",
    "Clones the documentation skeleton and the config file into the project."
  )
  .option(
    "--basePath <dir>",
    "The root folder of the project, the one where the documentation folder is or will be located."
  )
  .action((options) => {
    const install = new Install({
      ...options,
      ...configuration,
      packageVersion: version,
    });
    install.run();
  });

cli
  .command(
    "check",
    "Analyses the current project and shows a report about the status of the installed documentation."
  )
  .option(
    "--basePath <dir>",
    "The root folder of the project, the one where the documentation folder is located."
  )
  .action((options) => {
    const check = new Check({
      ...options,
      ...configuration,
      packageVersion: version,
    });
    check.run();
  });

cli
  .command(
    "update",
    "Clones the missing documentation chapters from the source package into the current project."
  )
  .option(
    "--basePath <dir>",
    "The root folder of the project, the one where the documentation folder is located."
  )
  .action((options) => {
    const update = new Update({
      ...options,
      ...configuration,
      packageVersion: version,
    });
    update.run();
  });

cli.help();
cli.version(require("../package.json").version);
cli.parse();