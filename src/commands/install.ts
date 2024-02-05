import * as fs from "fs-extra";
import { prompt } from "enquirer";
import { logger } from "../Logger";
import { messages } from "../shared/messages";
import { Command } from "./command";

export class Install extends Command {
  public async preliminaryCheck(): Promise<void> {
    if (this.existsConfigFile) {
      logger.error(messages.install.checkConfigExists);
      console.log("");
      process.exit(1);
    }

    if (this.existsDocsFolder && this.existsBackupDocsFolder) {
      logger.error(messages.install.checkFolderExist);
      console.log("");
      process.exit(1);
    }

    if (this.existsReadme && this.existsBackupReadme) {
      logger.error(messages.install.checkReadmeExists);
      console.log("");
      process.exit(1);
    }

    if (this.existsReadme) {
      const canRenameReadme: { confirm: boolean } = await prompt({
        type: "confirm",
        initial: "y",
        name: "confirm",
        message: messages.install.canRenameReadme,
      });

      if (!canRenameReadme.confirm) {
        logger.info(messages.install.cantRenameReadme);
        console.log("");
        process.exit(1);
      }
    }
  }

  public backupDocsFolder(): void {
    if (!this.existsDocsFolder) {
      return;
    }

    if (this.existsBackupDocsFolder) {
      logger.error(messages.install.backupFolderExists.message);
      process.exit(1);
    }

    fs.renameSync(this.docsPath, this.docsBackupPath);

    logger.info(messages.install.backupSuccesful);
  }

  public cloneDocsFolder = (): void => {
    if (this.existsDocsFolder) {
      throw Error(messages.install.docsFolderExists.message);
    }
    fs.copySync(this.docsSourcePath, this.docsPath);
    logger.info(messages.install.cloneSuccesful);
  };

  public backupReadme(): void {
    if (!this.existsReadme) {
      return;
    }
    if (this.existsBackupReadme) {
      logger.error(messages.install.backupReadmeExists.message);
      console.log("");
      process.exit(1);
    }

    fs.renameSync(this.readmePath, this.readmeBackupPath);
    logger.info(messages.install.readmeBackupSuccesful);
  }

  public cloneReadme = (): void => {
    if (this.existsReadme) {
      throw Error(messages.install.readmeExists.message);
    }
    fs.copySync(this.readmeSourcePath, this.readmePath);
    logger.info(messages.install.readmeCloneSuccesful);
  };

  public createsConfigFile = (): void => {
    if (this.existsConfigFile) {
      logger.error(messages.install.configFileExists);
      console.log("");
      process.exit(1);
    }
    const configFile = JSON.parse(
      fs.readFileSync(this.configFileSourcePath, {
        encoding: "utf8",
        flag: "r",
      })
    );
    configFile.version = this.packageVersion;
    fs.writeFileSync(this.configFilePath, JSON.stringify(configFile, null, 2));
    logger.info(messages.install.configFileCreated);
  };

  public async run() {
    await this.preliminaryCheck();
    this.backupDocsFolder();

    this.cloneDocsFolder();
    this.createsConfigFile();
    this.backupReadme();
    this.cloneReadme();

    console.log("");
    logger.success(messages.install.success);
    console.log("");
    process.exit(0);
  }
}
