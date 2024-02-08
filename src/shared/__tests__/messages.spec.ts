import { messages } from "../messages";
const stripAnsi = (s: string): string =>
  s.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

describe("messages", () => {
  it("selectDocumentationDirectory", async () => {
    expect(messages.install.selectDocumentationDirectory).toContain(
      "Please enter the name of the documentation directory that should be created."
    );
  });
  it("documentationDirectoryExists", async () => {
    expect(
      stripAnsi(
        messages.install.documentationDirectoryExists("test.md").message
      )
    ).toBe(
      'The selected directory "test.md" already exists. Please, run the "install" command again and provide a different directory name or delete the already existing directory before.'
    );
  });
  it("documentationDirectorySet", async () => {
    expect(
      stripAnsi(messages.install.documentationDirectorySet("test.md").message)
    ).toBe("Documentation directory has been set to: test.md");
  });
  it("noDocumentationDirectoryProvided", async () => {
    expect(
      stripAnsi(messages.install.noDocumentationDirectoryProvided.message)
    ).toBe(
      'Please, run the "install" command again and provide a name for the documentation directory.'
    );
  });
  it("cantRenameReadme", async () => {
    expect(stripAnsi(messages.install.cantRenameReadme.message)).toBe(
      'Please, rename or delete the "README" file and run the "install" command again.'
    );
  });
  it("canRenameReadme", async () => {
    expect(stripAnsi(messages.install.canRenameReadme)).toBe(
      "A README file exists already. \n Would you like to rename it to _README?"
    );
  });
  it("backupReadmeExists", async () => {
    expect(stripAnsi(messages.install.backupReadmeExists.message)).toBe(
      "The '_README.md' has been found."
    );
  });
  it("docsFolderExists", async () => {
    expect(stripAnsi(messages.install.docsFolderExists.message)).toBe(
      "The documentation folder has been found."
    );
  });
  it("readmeExists", async () => {
    expect(stripAnsi(messages.install.readmeExists.message)).toBe(
      "The 'README.md' file already exists."
    );
  });
  it("readmeBackupSuccesful", async () => {
    expect(stripAnsi(messages.install.readmeBackupSuccesful.message)).toBe(
      "The README.md file has been renamed to  '_README.md'"
    );
  });
  it("cloneSuccesful", async () => {
    expect(stripAnsi(messages.install.cloneSuccesful("./docs").message)).toBe(
      "The documentation ('./docs') has been successfully cloned into your project."
    );
  });
  it("readmeCloneSuccesful", async () => {
    expect(stripAnsi(messages.install.readmeCloneSuccesful.message)).toBe(
      "The README.md has been successfully cloned into your project."
    );
  });
  it("configFileExists", async () => {
    expect(stripAnsi(messages.install.configFileExists.message)).toBe(
      "The configuration file already exists."
    );
  });
  it("configFileCreated", async () => {
    expect(stripAnsi(messages.install.configFileCreated.message)).toBe(
      "The config file ('./deven-skeleton-install.config.json') has been successfully cloned into your project."
    );
  });
  it("success", async () => {
    expect(stripAnsi(messages.install.success.message)).toBe(
      "The documentation has been succesfully installed."
    );
  });
  it("checkReadmeExists", async () => {
    expect(stripAnsi(messages.install.checkReadmeExists.message)).toContain(
      "Both the  README.md and the readme backup ('_README.md') have been found."
    );
  });
  it("checkConfigExists", async () => {
    expect(stripAnsi(messages.install.checkConfigExists.message)).toContain(
      "The config file exists already."
    );
  });
  it("checkFolderExist", async () => {
    expect(stripAnsi(messages.check.checkFolderExist.message)).toBe(
      "The documentation directory has been found."
    );
  });
  it("checkOutdatedFolderExist", async () => {
    expect(stripAnsi(messages.check.checkOutdatedFolderExist.message)).toBe(
      "The outdated documentation folder has been found."
    );
  });
  it("percentage", async () => {
    expect(messages.check.percentage(10)).toEqual({
      prefix: "[check]",
      message: ["The documentation is %d% complete", "10"],
    });
  });
  it("checkFolderNotExist", async () => {
    expect(stripAnsi(messages.check.checkFolderNotExist.message)).toBe(
      "The documentation directory has not been found."
    );
  });
  it("checkOutdatedFolderNotExist", async () => {
    expect(stripAnsi(messages.check.checkOutdatedFolderNotExist.message)).toBe(
      "The outdated documentation folder has not been found."
    );
  });
  it("checkConfigNotExists", async () => {
    expect(stripAnsi(messages.check.checkConfigNotExists.message)).toContain(
      "The config file has not been found."
    );
  });
  it("readmeExists", async () => {
    expect(stripAnsi(messages.check.readmeExists.message)).toBe(
      "The 'README.md' file has been found."
    );
  });
  it("contentDocsFolder", async () => {
    expect(stripAnsi(messages.check.contentDocsFolder.message)).toContain(
      "Content of the documentation folder:"
    );
  });
  it("alreadyUpdated", async () => {
    expect(stripAnsi(messages.update.alreadyUpdated.message)).toBe(
      "The documentation is already up-to-date."
    );
  });
  it("configFileNotExist", async () => {
    expect(stripAnsi(messages.update.configFileNotExist.message)).toBe(
      "The config file hasn't been found."
    );
  });
  it("useNewDocumentationDirectory", async () => {
    expect(stripAnsi(messages.update.useNewDocumentationDirectory)).toContain(
      'The current documentation directory is "doc". The new suggestion for this directory is "docs", so GitHub can auto-detect files like the Code of Conduct, but you can also switch to any other directory.'
    );
  });
  it("noDocumentationDirectoryProvided", async () => {
    expect(
      stripAnsi(messages.update.noDocumentationDirectoryProvided.message)
    ).toBe(
      'Please, run the "update" command again and provide a name for the documentation directory.'
    );
  });
  it("documentationDirectoryExists", async () => {
    expect(
      stripAnsi(messages.update.documentationDirectoryExists("test").message)
    ).toBe(
      'The selected directory "test" already exists. Please, run the "update" command again and provide a different directory name or delete the already existing directory before.'
    );
  });
  it("updated", async () => {
    expect(stripAnsi(messages.update.updated.message)).toBe(
      "The documentation has been succesfully updated."
    );
  });
  it("versionNotUpdated", async () => {
    expect(stripAnsi(messages.update.versionNotUpdated.message)).toBe(
      "The documentation version is already the latest available."
    );
  });
  it("documentationDirectoryAddedToConfig", async () => {
    expect(
      stripAnsi(messages.update.documentationDirectoryAddedToConfig.message)
    ).toBe(
      "The documentation directory has been successfully added to the config file."
    );
  });
  it("configFileUpdated", async () => {
    expect(stripAnsi(messages.update.configFileUpdated.message)).toBe(
      "The config file has been updated."
    );
  });
  it("configFileParsed", async () => {
    expect(stripAnsi(messages.update.configFileParsed.message)).toBe(
      "The config file has been found and parsed."
    );
  });
  it("configFileUnparsable", async () => {
    expect(stripAnsi(messages.update.configFileUnparsable.message)).toBe(
      "The config file could not be parsed."
    );
  });
  it("keepDocDirectory", async () => {
    expect(stripAnsi(messages.update.keepDocDirectory.message)).toBe(
      "The documentation directory is still named ('./doc')."
    );
  });
  it("renamedOutdatedDocFolder", async () => {
    expect(
      stripAnsi(messages.update.renamedOutdatedDocFolder("test").message)
    ).toContain(
      "The documentation directory has been renamed from ('doc') to ('test')."
    );
  });
  it("renamedCodeOfConduct", async () => {
    expect(stripAnsi(messages.update.renamedCodeOfConduct.message)).toContain(
      "The CODEOFCONDUCT.md file has been renamed to CODE_OF_CONDUCT.md."
    );
  });
  it("renamedProjectBackground", async () => {
    expect(
      stripAnsi(messages.update.renamedProjectBackground.message)
    ).toContain(
      "The PROJECTBACKGROUND.md file has been renamed to PROJECT_BACKGROUND.md."
    );
  });
  it("renamedGetStarted", async () => {
    expect(stripAnsi(messages.update.renamedGetStarted.message)).toContain(
      "The GETSTARTED.md file has been renamed to GET_STARTED.md."
    );
  });
});
