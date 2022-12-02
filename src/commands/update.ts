import * as fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import semverCompare from "semver-compare";

import { logger } from "../Logger";
import { messages } from "../shared/messages";
import { Command } from "./command";

export class Update extends Command {
  public preliminaryCheck(): void {
    if (this.existsConfigFile) {
      logger.info(messages.check.checkConfigExists);
    } else {
      logger.error(messages.check.checkConfigNotExists);
      process.exit(1);
    }
  }

  public updateChapters() {
    if (!this.existsDocFolder) {
      fs.mkdirSync(this.docPath);
    }

    if (!this.existsReadme) {
      fs.copySync(this.readmeSourcePath, this.readmePath);
      logger.info(messages.install.readmeCloneSuccesful);
    }

    const missingFiles = this.docSourceFiles.filter(
      (value) => !this.docFiles.includes(value)
    );

    if (missingFiles.length === 0) {
      logger.info(messages.update.alreadyUpdated);
      return;
    }

    missingFiles.forEach((m) => {
      fs.copyFileSync(
        path.join(this.docSourcePath, m),
        path.join(this.docPath, m)
      );
    });

    const table = new Table({
      style: { head: ["cyan"] },
      head: [`New Chapters (vers. ${this.packageVersion})`, `Status`],
      colWidths: [40],
    });

    missingFiles.forEach((f) => {
      table.push([
        f.replace(".md", ""),
        this.docFiles.includes(f)
          ? chalk.green(`Copied`)
          : chalk.red("Not copied"),
      ]);
    });

    console.log(table.toString());

    logger.success(messages.update.updated);
  }

  public updateConfigFile() {
    if (!this.existsConfigFile) {
      logger.error(messages.update.configFileNotExist.message);
      process.exit(1);
      return false;
    }

    const configFile = JSON.parse(
      fs.readFileSync(this.configFilePath, { encoding: "utf8", flag: "r" })
    );
    if (semverCompare(this.packageVersion, configFile.version) <= 0) {
      logger.info(messages.update.versionNotUpdated);
      process.exit(0);
      return false;
    }
    configFile.version = this.packageVersion;
    fs.writeFileSync(this.configFilePath, JSON.stringify(configFile, null, 2));

    logger.success(messages.update.configFileUpdated);
  }

  public run() {
    this.preliminaryCheck();
    this.updateChapters();
    this.updateConfigFile();
    process.exit(0);
  }
}
