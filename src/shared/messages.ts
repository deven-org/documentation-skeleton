import chalk from "chalk";

export const messages = {
  install: {
    backupFolderExists: {
      prefix: "[install]",
      message: `The ${chalk.bold(
        "documentation backup"
      )} folder has been found in your project.`,
    },
    cantRenameReadme: {
      prefix: "[install]",
      message: `Please, ${chalk.bold(
        'rename or delete the "README"'
      )} file and run the "install" command again.`,
    },
    canRenameReadme:
      "A README file exists already. \n Would you like to rename it to _README?",
    backupReadmeExists: {
      prefix: "[install]",
      message: `The ${chalk.bold("'_README.md'")} has been found.`,
    },
    docFolderExists: {
      prefix: "[install]",
      message: `The ${chalk.bold("documentation folder")} has been found.`,
    },
    readmeExists: {
      prefix: "[install]",
      message: `The ${chalk.bold("'README.md'")} file already exists.`,
    },
    backupSuccesful: {
      prefix: "[install]",
      message: `The ${chalk.bold(
        "documentation folder"
      )} has been renamed to ${chalk.bold("'./_doc'")}.`,
    },
    readmeBackupSuccesful: {
      prefix: "[install]",
      message: `The ${chalk.bold(
        "README.md"
      )} file has been renamed to  ${chalk.bold("'_README.md'")}`,
    },
    cloneSuccesful: {
      prefix: "[install]",
      message: `The ${chalk.bold("documentation")} ${chalk.italic(
        "('./_doc')"
      )} has been successfully cloned into your project.`,
    },
    readmeCloneSuccesful: {
      prefix: "[install]",
      message: `The ${chalk.bold(
        "README.md"
      )} has been successfully cloned into your project.`,
    },
    configFileExists: {
      prefix: "[install]",
      message: `The doc folder already exists.`,
    },
    configFileCreated: {
      prefix: "[install]",
      message: `The ${chalk.bold("config file")} ${chalk.italic(
        "('./deven-skeleton-install.config.json')"
      )} has been successfully cloned into your project.`,
    },
    success: {
      prefix: "[install]",
      message: `The documentation has been succesfully installed.`,
    },
    checkFolderExist: {
      prefix: "[install]",
      message: `Both the documentation folder ${chalk.italic(
        "('./doc')"
      )} and the documentation backup ${chalk.italic(
        "('./_doc')"
      )} folder have been found.
      \n In order to continue, you might want to ${chalk.bold(
        "rename or delete at least one of them"
      )}.`,
    },
    checkReadmeExists: {
      prefix: "[install]",
      message: `Both the  ${chalk.bold(
        "README.md"
      )} and the readme backup ${chalk.bold("('_README.md')")} have been found.
      \n In order to continue, you might want to ${chalk.bold(
        "rename or delete at least one of them"
      )}.`,
    },
    checkConfigExists: {
      prefix: "[install]",
      message: `The config file exists already.
                \nThe documentation of this project it might be already handled by deven-src-install
                \n${chalk.bold("You might be looking for 'update'.")}`,
    },
  },
  check: {
    checkConfigExists: {
      prefix: "[check]",
      message: `The ${chalk.bold("config file")} has been found.`,
    },
    checkFolderExist: {
      prefix: "[check]",
      message: `The ${chalk.bold("documentation folder")} has been found.`,
    },
    checkFolderNotExist: {
      prefix: "[check]",
      message: `The ${chalk.bold("documentaton folder")} has been found.`,
    },
    checkConfigNotExists: {
      prefix: "[check]",
      message: `The ${chalk.bold("config file")} has not been found.
      \n${chalk.bold("You might be looking for 'install'.")}`,
    },
    readmeExists: {
      prefix: "[check]",
      message: `The ${chalk.bold("'README.md'")} file has been found.`,
    },
    percentage: (perc: number) => {
      return {
        prefix: "[check]",
        message: ["The documentation is %d% complete", perc.toString()],
      };
    },
    contentDocFolder: {
      message: `\n${chalk.bold("Content of the documentation folder:")}`,
    },
  },
  update: {
    alreadyUpdated: {
      prefix: "[update]",
      message: `The documentation is already up-to-date.`,
    },
    configFileNotExist: {
      prefix: "[update]",
      message: `The config file hasn't been found.`,
    },
    updated: {
      prefix: "[update]",
      message: `The documentation has been succesfully updated.`,
    },
    versionNotUpdated: {
      prefix: "[update]",
      message: `The doc version is already the latest available.`,
    },
    configFileUpdated: {
      prefix: "[update]",
      message: `The config file has been updated.`,
    },
  },
};
