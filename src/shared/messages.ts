import chalk from "chalk";

export type Message = {
  prefix: string;
  message: string;
};

export const messages = {
  install: {
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
    docsFolderExists: {
      prefix: "[install]",
      message: `The ${chalk.bold("documentation folder")} has been found.`,
    },
    readmeExists: {
      prefix: "[install]",
      message: `The ${chalk.bold("'README.md'")} file already exists.`,
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
        "('./docs')"
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
      message: `The configuration file already exists.`,
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
    checkOutdatedFolderExist: {
      prefix: "[check]",
      message: `The outdated ${chalk.bold(
        "documentation folder"
      )} has been found.`,
    },
    checkFolderNotExist: {
      prefix: "[check]",
      message: `The ${chalk.bold("documentation folder")} has not been found.`,
    },
    checkOutdatedFolderNotExist: {
      prefix: "[check]",
      message: `The outdated ${chalk.bold(
        "documentation folder"
      )} has not been found.`,
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
    contentDocsFolder: {
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
      message: `The documentation version is already the latest available.`,
    },
    configFileUpdated: {
      prefix: "[update]",
      message: `The config file has been updated.`,
    },
    outdatedDocFolderCannotBeRenamed: {
      prefix: "[update]",
      message: `Both the outdated documentation folder ${chalk.italic(
        "('./doc')"
      )} and the designated new documentation folder ${chalk.italic(
        "('./docs')"
      )} have been found.
      In order to continue, you might want to rename or delete the existing ${chalk.italic(
        "('./docs')"
      )} folder.
      Please make sure that it is not used and thus overwritten by some other (e.g. deployment) process.`,
    },
    renamedOutdatedDocFolderToDocs: {
      prefix: "[update]",
      message: `The documentation folder has been updated from ${chalk.italic(
        "('./doc')"
      )} to ${chalk.italic("('./docs')")}.
      Please make sure to update all links that point to the documentation.`,
    },
    renamedCodeOfConduct: {
      prefix: "[update]",
      message: `The ${chalk.italic(
        "CODEOFCONDUCT.md"
      )} file has been renamed to ${chalk.italic("CODE_OF_CONDUCT.md")}.
      Please make sure to update all links that point to this file.`,
    },
    renamedProjectBackground: {
      prefix: "[update]",
      message: `The ${chalk.italic(
        "PROJECTBACKGROUND.md"
      )} file has been renamed to ${chalk.italic("PROJECT_BACKGROUND.md")}.
      Please make sure to update all links that point to this file.`,
    },
    renamedGetStarted: {
      prefix: "[update]",
      message: `The ${chalk.italic(
        "GETSTARTED.md"
      )} file has been renamed to ${chalk.italic("GET_STARTED.md")}.
      Please make sure to update all links that point to this file.`,
    },
  },
};
