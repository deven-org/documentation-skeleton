import chalk from "chalk";
import Table from "cli-table3";
import * as fs from "fs-extra";

import { logger } from "../Logger";
import { messages } from "../shared/messages";
import { BaseCommand } from "./command";
import { ConfigFile } from "../interfaces";

export class Check extends BaseCommand {
  steps = [this.preliminaryCheck.bind(this), this.checkChapters.bind(this)];

  public async preliminaryCheck(): Promise<boolean> {
    if (this.existsConfigFile()) {
      logger.info(messages.check.checkConfigExists);
    } else {
      logger.error(messages.check.checkConfigNotExists);
      return false;
    }

    try {
      const configText = fs.readFileSync(this.configFilePath, "utf8");
      // This is an unsafe assumption as we have no control over the file
      // contents, but we will be careful and catch errors.
      const config = JSON.parse(configText) as Partial<ConfigFile>;

      // not being able to access a field (due to the json contents not being an
      // object, will be caught and treated the same as an open/parse error)
      const version = config.version;
      const documentationDirectory = config.documentationDirectory;

      if (typeof version !== "string") {
        logger.error(messages.check.checkConfigFieldVersionMissing);
        return false;
      }

      if (version !== this.packageVersion) {
        logger.error(
          messages.check.checkConfigFieldVersionMismatch(
            version,
            this.packageVersion
          )
        );
        return false;
      }

      if (typeof documentationDirectory !== "string") {
        logger.error(messages.check.checkConfigFieldDocDirMissing);
        return false;
      }

      this.documentationDirectory = documentationDirectory;
    } catch (e: unknown) {
      logger.error(messages.check.checkConfigFileReadable(this.configFilePath));
      return false;
    }

    logger.info(messages.check.checkConfigFileValid);

    logger.info(messages.check.checkDocDirPathFound(this.docsPath));

    if (this.existsDocsFolder()) {
      logger.info(messages.check.checkFolderExist);
    } else {
      logger.error(messages.check.checkFolderNotExist);
      return false;
    }

    if (this.existsReadme()) {
      logger.info(messages.check.readmeExists);
    } else {
      logger.error(messages.check.checkFolderNotExist);
      return false;
    }

    return true;
  }

  public async checkChapters(): Promise<boolean> {
    console.log(chalk.bold(messages.check.contentDocsFolder.message));
    const table = new Table({
      style: { head: ["cyan"] },
      head: [
        `Files (vers. ${this.packageVersion})`,
        `Project (${Math.round(this.coverage())}% file coverage)`,
      ],
      colWidths: [40],
    });

    this.findDocsSourceFiles().forEach((f) => {
      table.push([
        f.replace(".md", ""),
        this.findDocsFiles().includes(f)
          ? chalk.green(`Found`)
          : chalk.red("Not found"),
      ]);
    });

    console.log(table.toString());

    return true;
  }
}
