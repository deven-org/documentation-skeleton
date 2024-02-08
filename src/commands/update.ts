import * as fs from "fs-extra";
import path from "path";
import chalk from "chalk";
import Table from "cli-table3";
import semverCompare from "semver-compare";
import { prompt } from "enquirer";

import { logger } from "../Logger";
import { Message, messages } from "../shared/messages";
import { BaseCommand } from "./command";
import { ConfigFile } from "../interfaces";

export class Update extends BaseCommand {
  steps = [
    this.preliminaryCheck.bind(this),
    this.readConfigfile.bind(this),
    this.updateOutdatedDirectoryName.bind(this),
    this.updateOutdatedFileNames.bind(this),
    this.updateChapters.bind(this),
    this.updateConfigFile.bind(this),
  ];

  #config: Partial<ConfigFile> = {};

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

  public async preliminaryCheck(): Promise<boolean> {
    if (this.existsConfigFile()) {
      logger.info(messages.check.checkConfigExists);
    } else {
      logger.error(messages.check.checkConfigNotExists);
      return false;
    }

    if (this.existsOutdatedDocFolder()) {
      logger.info(messages.check.checkOutdatedFolderExist);
    } else {
      logger.info(messages.check.checkOutdatedFolderNotExist);
    }

    return true;
  }

  public async readConfigfile(): Promise<boolean> {
    try {
      const configText = fs.readFileSync(this.configFilePath, "utf8");
      // This is an unsafe assumption as we have no control over the file
      // contents, but we will be careful and catch errors.
      this.#config = JSON.parse(configText) as Partial<ConfigFile>;

      if (
        this.#config.documentationDirectory &&
        typeof this.#config.documentationDirectory === "string"
      ) {
        this.documentationDirectory = this.#config.documentationDirectory;
      }
      logger.info(messages.update.configFileParsed);
    } catch (e: unknown) {
      logger.error(messages.update.configFileUnparsable);
      return false;
    }
    return true;
  }

  public async updateOutdatedDirectoryName(): Promise<boolean> {
    if (!this.existsOutdatedDocFolder()) {
      return true;
    }

    if (this.documentationDirectory === null) {
      const documentationDirectory: { directory: string } = await prompt({
        type: "input",
        initial: "docs",
        name: "directory",
        message: messages.update.useNewDocumentationDirectory,
      });

      if (
        documentationDirectory === undefined ||
        documentationDirectory.directory === ""
      ) {
        logger.error(messages.update.noDocumentationDirectoryProvided);
        return false;
      }

      this.documentationDirectory = documentationDirectory.directory;

      if (this.outdatedDocPath === this.docsPath) {
        logger.info(messages.update.keepDocDirectory);
      } else {
        if (this.existsDocsFolder()) {
          logger.error(
            messages.update.documentationDirectoryExists(
              this.documentationDirectory
            )
          );
          return false;
        }
        fs.renameSync(this.outdatedDocPath, this.docsPath);
        logger.info(
          messages.update.renamedOutdatedDocFolder(this.documentationDirectory)
        );
      }
    }

    return true;
  }

  public async updateOutdatedFileNames(): Promise<boolean> {
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

    return true;
  }

  public async updateChapters(): Promise<boolean> {
    if (!this.existsDocsFolder()) {
      fs.mkdirSync(this.docsPath);
    }

    if (!this.existsReadme()) {
      fs.copySync(this.readmeSourcePath, this.readmePath);
      logger.info(messages.install.readmeCloneSuccesful);
    }

    const missingFiles = this.findDocsSourceFiles().filter(
      (value) => !this.findDocsFiles().includes(value)
    );

    if (missingFiles.length === 0) {
      logger.info(messages.update.alreadyUpdated);
      return true;
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
        this.findDocsFiles().includes(f)
          ? chalk.green(`Copied`)
          : chalk.red("Not copied"),
      ]);
    });

    console.log(table.toString());

    logger.success(messages.update.updated);
    return true;
  }

  public async updateConfigFile(): Promise<boolean> {
    if (!this.existsConfigFile()) {
      logger.error(messages.update.configFileNotExist.message);
      return false;
    }

    let updateAvailable = false;

    if (!this.#config.documentationDirectory && this.documentationDirectory) {
      this.#config.documentationDirectory = this.documentationDirectory;
      logger.info(messages.update.documentationDirectoryAddedToConfig);
      updateAvailable = true;
    }

    if (
      this.#config.version &&
      semverCompare(this.packageVersion, this.#config.version) <= 0
    ) {
      logger.info(messages.update.versionNotUpdated);
    } else {
      this.#config.version = this.packageVersion;
      updateAvailable = true;
    }

    if (updateAvailable) {
      fs.writeFileSync(
        this.configFilePath,
        JSON.stringify(this.#config, null, 2)
      );

      logger.success(messages.update.configFileUpdated);
    }
    return true;
  }
}
