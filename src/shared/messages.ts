import chalk from "chalk";

export type Message = {
  prefix: string;
  message: string;
};

export const messages = {
  install: {
    selectDocumentationDirectory:
      'Please enter the name of the documentation directory that should be created.\nIf the directory already exists, name clashes will have to be resolved manually.\nIf possible, the default of "docs" should be used, so GitHub can auto-detect files like the Code of Conduct.\nDocumentation directory:',
    documentationDirectoryExists: (directory: string) => {
      return {
        prefix: "[install]",
        message: `The selected directory "${directory}" already exists. Please, run the "install" command again and ${chalk.bold(
          "provide a different directory name"
        )} or ${chalk.bold("delete the already existing directory")} before.`,
      };
    },
    documentationDirectorySet: (directory: string) => {
      return {
        prefix: "[install]",
        message: `Documentation directory has been set to: ${directory}`,
      };
    },
    noDocumentationDirectoryProvided: {
      prefix: "[install]",
      message: `Please, run the "install" command again and ${chalk.bold(
        "provide a name for the documentation directory"
      )}.`,
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
    cloneSuccesful: (docDirPath: string) => ({
      prefix: "[install]",
      message: `The ${chalk.bold("documentation")} ${chalk.italic(
        `('${docDirPath}')`
      )} has been successfully cloned into your project.`,
    }),
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
      message: `The ${chalk.bold("documentation directory")} has been found.`,
    },
    checkOutdatedFolderExist: {
      prefix: "[check]",
      message: `The outdated ${chalk.bold(
        "documentation folder"
      )} has been found.`,
    },
    checkFolderNotExist: {
      prefix: "[check]",
      message: `The ${chalk.bold(
        "documentation directory"
      )} has not been found.`,
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
    checkConfigFileReadable: (filePath: string) => ({
      prefix: "[check]",
      message: `Could not open or parse the config file at '${filePath}'
      \nMake sure the file can be read and written to and is a valid JSON object.`,
    }),
    checkConfigFieldVersionMissing: {
      prefix: "[check]",
      message: `The config file is missing a valid ${chalk.bold(
        '"version"'
      )} field, please fix it or re-install the documentation-skeleton.`,
    },
    checkConfigFieldVersionMismatch: (
      foundVersion: string,
      ownVersion: string
    ) => ({
      prefix: "[check]",
      message: `The version specified in the config file is ${chalk.bold(
        `'${foundVersion}'`
      )}, but the installed version of the documentation-skeleton package is ${chalk.bold(
        `'${ownVersion}'`
      )}
      \nMake sure the installed version is correct and run the ${chalk.bold(
        "update"
      )} command first.`,
    }),
    checkConfigFieldDocDirMissing: {
      prefix: "[check]",
      message: `The config file is missing a valid ${chalk.bold(
        '"documentationDirectory"'
      )} field, please fix it or re-install the documentation-skeleton.`,
    },
    checkConfigFileValid: {
      prefix: "[check]",
      message: `The config file is valid`,
    },
    checkDocDirPathFound: (docDirPath: string) => ({
      prefix: "[check]",
      message: `The documentation directory is: '${docDirPath}'`,
    }),
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
    useNewDocumentationDirectory:
      'The current documentation directory is "doc". The new suggestion for this directory is "docs", so GitHub can auto-detect files like the Code of Conduct, but you can also switch to any other directory.\nIf the directory already exists, name clashes will have to be resolved manually.\nDocumentation directory:',
    noDocumentationDirectoryProvided: {
      prefix: "[update]",
      message: `Please, run the "update" command again and ${chalk.bold(
        "provide a name for the documentation directory"
      )}.`,
    },
    documentationDirectoryExists: (directory: string) => {
      return {
        prefix: "[update]",
        message: `The selected directory "${directory}" already exists. Please, run the "update" command again and ${chalk.bold(
          "provide a different directory name"
        )} or ${chalk.bold("delete the already existing directory")} before.`,
      };
    },
    updated: {
      prefix: "[update]",
      message: `The documentation has been succesfully updated.`,
    },
    versionNotUpdated: {
      prefix: "[update]",
      message: `The documentation version is already the latest available.`,
    },
    documentationDirectoryAddedToConfig: {
      prefix: "[update]",
      message: `The documentation directory has been successfully added to the config file.`,
    },
    configFileUpdated: {
      prefix: "[update]",
      message: `The config file has been updated.`,
    },
    configFileParsed: {
      prefix: "[update]",
      message: `The config file has been found and parsed.`,
    },
    configFileUnparsable: {
      prefix: "[update]",
      message: `The config file could not be parsed.`,
    },
    keepDocDirectory: {
      prefix: "[update]",
      message: `The documentation directory is still named ${chalk.italic(
        "('./doc')"
      )}.`,
    },
    renamedOutdatedDocFolder: (docDirPath: string) => {
      return {
        prefix: "[update]",
        message: `The documentation directory has been renamed from ${chalk.italic(
          "('doc')"
        )} to ${chalk.italic(`('${docDirPath}')`)}.
      Please make sure to update all links that point to the documentation.`,
      };
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
