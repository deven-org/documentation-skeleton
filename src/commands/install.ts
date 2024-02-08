import * as fs from "fs-extra";
import { prompt } from "enquirer";
import { logger } from "../Logger";
import { messages } from "../shared/messages";
import { BaseCliParams, BaseCommand } from "./command";
import { ConfigFile } from "../interfaces";

interface InstallCliParams extends BaseCliParams {
  documentationDirectory: string | undefined;
}

export class Install extends BaseCommand<InstallCliParams> {
  steps = [
    this.preliminaryCheck.bind(this),
    this.cloneDocsFolder.bind(this),
    this.createsConfigFile.bind(this),
    this.backupReadme.bind(this),
    this.cloneReadme.bind(this),
    this.reportSuccess.bind(this),
  ];

  constructor(params: InstallCliParams, packageVersion: string) {
    super(params, packageVersion);
    this.documentationDirectory = params.documentationDirectory || null;
  }

  public async preliminaryCheck(): Promise<boolean> {
    if (this.existsConfigFile()) {
      logger.error(messages.install.checkConfigExists);
      console.log("");
      return false;
    }

    if (this.documentationDirectory === null) {
      const documentationDirectory: { directory: string } = await prompt({
        type: "input",
        initial: "docs",
        name: "directory",
        message: messages.install.selectDocumentationDirectory,
      });

      if (
        documentationDirectory === undefined ||
        documentationDirectory.directory === ""
      ) {
        logger.error(messages.install.noDocumentationDirectoryProvided);
        return false;
      }

      this.documentationDirectory = documentationDirectory.directory;
    }

    if (this.existsDocsFolder()) {
      logger.error(
        messages.install.documentationDirectoryExists(
          this.documentationDirectory
        )
      );
      return false;
    }
    logger.info(
      messages.install.documentationDirectorySet(this.documentationDirectory)
    );

    if (this.existsReadme() && this.existsBackupReadme()) {
      logger.error(messages.install.checkReadmeExists);
      console.log("");
      return false;
    }

    if (this.existsReadme()) {
      const canRenameReadme: { confirm: boolean } = await prompt({
        type: "confirm",
        initial: "Y",
        name: "confirm",
        message: messages.install.canRenameReadme,
      });

      if (!canRenameReadme.confirm) {
        logger.info(messages.install.cantRenameReadme);
        console.log("");
        return false;
      }
    }

    return true;
  }

  async cloneDocsFolder(): Promise<boolean> {
    if (this.existsDocsFolder()) {
      logger.error(messages.install.docsFolderExists);
      return false;
    }

    fs.copySync(this.docsSourcePath, this.docsPath);
    logger.info(messages.install.cloneSuccesful(this.docsPath));
    return true;
  }

  public async backupReadme(): Promise<boolean> {
    if (!this.existsReadme()) {
      return true;
    }
    if (this.existsBackupReadme()) {
      logger.error(messages.install.backupReadmeExists);
      return false;
    }

    fs.renameSync(this.readmePath, this.readmeBackupPath);
    logger.info(messages.install.readmeBackupSuccesful);
    return true;
  }

  public async cloneReadme(): Promise<boolean> {
    if (this.existsReadme()) {
      logger.error(messages.install.readmeExists);
      return false;
    }
    fs.copySync(this.readmeSourcePath, this.readmePath);
    logger.info(messages.install.readmeCloneSuccesful);
    return true;
  }

  public async createsConfigFile(): Promise<boolean> {
    if (this.existsConfigFile()) {
      logger.error(messages.install.configFileExists);
      return false;
    }
    const configFile: ConfigFile = JSON.parse(
      fs.readFileSync(this.configFileSourcePath, {
        encoding: "utf8",
        flag: "r",
      })
    );
    configFile.version = this.packageVersion;
    /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion
       -------
       must be initialized in preliminary check at this point
    */
    configFile.documentationDirectory = this.documentationDirectory!;
    fs.writeFileSync(this.configFilePath, JSON.stringify(configFile, null, 2));
    logger.info(messages.install.configFileCreated);

    return true;
  }

  public async reportSuccess(): Promise<boolean> {
    console.log("");
    logger.success(messages.install.success);
    console.log("");
    return true;
  }
}
