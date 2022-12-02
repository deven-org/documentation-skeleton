import { messages } from "../messages";
const stripAnsi = (s: string): string =>
  s.replace(
    /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ""
  );

describe("messages", () => {
  it("backupFolderExists", async () => {
    expect(stripAnsi(messages.install.backupFolderExists.message)).toBe(
      "The documentation backup folder has been found in your project."
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
  it("docFolderExists", async () => {
    expect(stripAnsi(messages.install.docFolderExists.message)).toBe(
      "The documentation folder has been found."
    );
  });
  it("readmeExists", async () => {
    expect(stripAnsi(messages.install.readmeExists.message)).toBe(
      "The 'README.md' file already exists."
    );
  });
  it("backupSuccesful", async () => {
    expect(stripAnsi(messages.install.backupSuccesful.message)).toBe(
      "The documentation folder has been renamed to './_doc'."
    );
  });
  it("readmeBackupSuccesful", async () => {
    expect(stripAnsi(messages.install.readmeBackupSuccesful.message)).toBe(
      "The README.md file has been renamed to  '_README.md'"
    );
  });
  it("cloneSuccesful", async () => {
    expect(stripAnsi(messages.install.cloneSuccesful.message)).toBe(
      "The documentation ('./_doc') has been successfully cloned into your project."
    );
  });
  it("readmeCloneSuccesful", async () => {
    expect(stripAnsi(messages.install.readmeCloneSuccesful.message)).toBe(
      "The README.md has been successfully cloned into your project."
    );
  });
  it("configFileExists", async () => {
    expect(stripAnsi(messages.install.configFileExists.message)).toBe(
      "The doc folder already exists."
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
  it("checkFolderExist", async () => {
    expect(stripAnsi(messages.install.checkFolderExist.message)).toContain(
      "Both the documentation folder ('./doc') and the documentation backup ('./_doc') folder have been found."
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
      "The documentation folder has been found."
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
      "The documentaton folder has been found."
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
  it("contentDocFolder", async () => {
    expect(stripAnsi(messages.check.contentDocFolder.message)).toContain(
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
  it("updated", async () => {
    expect(stripAnsi(messages.update.updated.message)).toBe(
      "The documentation has been succesfully updated."
    );
  });
  it("versionNotUpdated", async () => {
    expect(stripAnsi(messages.update.versionNotUpdated.message)).toBe(
      "The doc version is already the latest available."
    );
  });
  it("configFileUpdated", async () => {
    expect(stripAnsi(messages.update.configFileUpdated.message)).toBe(
      "The config file has been updated."
    );
  });
});
