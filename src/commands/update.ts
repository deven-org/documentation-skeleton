import * as fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import semverCompare from "semver-compare";

import { logger } from "../Logger";
import { Message, messages } from "../shared/messages";
import { Command } from "./command";

export class Update extends Command {
  private renameFile(
    oldFileName: string,
    newFileName: string,
    loggerMessage: Message
  ): void {
    const oldFilePath = this.getDocsFilePath(oldFileName);

    if (!fs.existsSync(oldFilePath)) {
      return;
    }

    fs.renameSync(oldFilePath, this.getDocsFilePath(newFileName));

    logger.info(loggerMessage);
  }

  public preliminaryCheck(): void {
    if (this.existsConfigFile) {
      logger.info(messages.check.checkConfigExists);
    } else {
      logger.error(messages.check.checkConfigNotExists);
      process.exit(1);
    }

    if (this.existsOutdatedDocFolder) {
      logger.info(messages.check.checkOutdatedFolderExist);
      if (this.existsDocsFolder) {
        logger.error(messages.update.outdatedDocFolderCannotBeRenamed);
        process.exit(1);
      }
    } else {
      logger.info(messages.check.checkOutdatedFolderNotExist);
    }
  }

  public updateOutdatedFolderName() {
    if (!this.existsOutdatedDocFolder) {
      return;
    }

    fs.renameSync(this.outdatedDocPath, this.docsPath);
    logger.info(messages.update.renamedOutdatedDocFolderToDocs);
  }

  public updateOutdatedFileNames() {
    const filesToRename = [
      {
        old: "CODEOFCONDUCT.md",
        new: "CODE_OF_CONDUCT.md",
        message: messages.update.renamedCodeOfConduct,
      },
      {
        old: "GETSTARTED.md",
        new: "GET_STARTED.md",
        message: messages.update.renamedGetStarted,
      },
      {
        old: "PROJECTBACKGROUND.md",
        new: "PROJECT_BACKGROUND.md",
        message: messages.update.renamedProjectBackground,
      },
    ];

    filesToRename.forEach((file) => {
      this.renameFile(file.old, file.new, file.message);
    });
  }

  public updateChapters() {
    if (!this.existsDocsFolder) {
      fs.mkdirSync(this.docsPath);
    }

    if (!this.existsReadme) {
      fs.copySync(this.readmeSourcePath, this.readmePath);
      logger.info(messages.install.readmeCloneSuccesful);
    }

    const missingFiles = this.docsSourceFiles.filter(
      (value) => !this.docsFiles.includes(value)
    );

    if (missingFiles.length === 0) {
      logger.info(messages.update.alreadyUpdated);
      return;
    }

    missingFiles.forEach((m) => {
      fs.copyFileSync(
        path.join(this.docsSourcePath, m),
        path.join(this.docsPath, m)
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
        this.docsFiles.includes(f)
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
      // Although this code is unreachable, it's currently required for test execution,
      // because the mock for process.exit does not stop code execution.
      // TODO: reconfigure mock so that tests can be executed without this additional return value.
      return false;
    }

    const configFile = JSON.parse(
      fs.readFileSync(this.configFilePath, { encoding: "utf8", flag: "r" })
    );
    if (semverCompare(this.packageVersion, configFile.version) <= 0) {
      logger.info(messages.update.versionNotUpdated);
      process.exit(0);
      // Although this code is unreachable, it's currently required for test execution,
      // because the mock for process.exit does not stop code execution.
      // TODO: reconfigure mock so that tests can be executed without this additional return value.
      return false;
    }
    configFile.version = this.packageVersion;
    fs.writeFileSync(this.configFilePath, JSON.stringify(configFile, null, 2));

    logger.success(messages.update.configFileUpdated);
  }

  public run() {
    this.preliminaryCheck();
    this.updateOutdatedFolderName();
    this.updateOutdatedFileNames();
    this.updateChapters();
    this.updateConfigFile();
    process.exit(0);
  }
}
