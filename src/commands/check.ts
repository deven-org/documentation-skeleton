import chalk from "chalk";
import Table from "cli-table3";

import { logger } from "../Logger";
import { messages } from "../shared/messages";
import { Command } from "./command";

export class Check extends Command {
  public preliminaryCheck(): void {
    if (this.existsConfigFile) {
      logger.info(messages.check.checkConfigExists);
    } else {
      logger.error(messages.check.checkConfigNotExists);
      process.exit(1);
    }

    if (this.existsDocFolder) {
      logger.info(messages.check.checkFolderExist);
    } else {
      logger.error(messages.check.checkFolderNotExist);
      process.exit(1);
    }

    if (this.existsReadme) {
      logger.info(messages.check.readmeExists);
    } else {
      logger.error(messages.check.checkFolderNotExist);
      process.exit(1);
    }
  }

  public checkChapters() {
    console.log(chalk.bold(messages.check.contentDocFolder.message));
    const table = new Table({
      style: { head: ["cyan"] },
      head: [
        `Files (vers. ${this.packageVersion})`,
        `Project (${Math.round(this.coverage)}% file coverage)`,
      ],
      colWidths: [40],
    });

    this.docSourceFiles.forEach((f) => {
      table.push([
        f.replace(".md", ""),
        this.docFiles.includes(f)
          ? chalk.green(`Found`)
          : chalk.red("Not found"),
      ]);
    });

    console.log(table.toString());
  }

  public run() {
    this.preliminaryCheck();
    this.checkChapters();
    process.exit(0);
  }
}
