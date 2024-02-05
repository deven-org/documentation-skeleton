import * as path from "path";
import * as fs from "fs-extra";
import { configuration } from "../shared/configuration";
import { Update } from "../commands";
import { logger } from "../Logger";
import mockFs from "mock-fs";
import {
  mockProcessExit,
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { messages } from "../shared/messages";

let mockExit: jest.SpyInstance;
let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

let update: Update;
describe("deven-cli", () => {
  afterEach(() => {
    mockFs.restore();
    mockExit.mockRestore();
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    mockLog.mockRestore();
    jest.clearAllMocks();
  });
  beforeEach(() => {
    mockExit = mockProcessExit();
    mockStdout = mockProcessStdout();
    mockStderr = mockProcessStderr();
    mockLog = mockConsoleLog();
    mockFs({
      fake_test_folder: {},
      "src/docs": mockFs.load(path.resolve("src/docs"), {
        lazy: false,
      }),
      "src/root": mockFs.load(path.resolve("src/root"), {
        lazy: false,
      }),
    });
    update = new Update({
      basePath: "fake_test_folder",
      ...configuration,
      moduleBasePath: path.join(".", "src"),
      packageVersion: "1.0.0",
    });
  });

  describe("update", () => {
    it("shows a positive message if the config has been found", async () => {
      fs.writeFileSync(update.configFilePath, "");
      const info = jest.spyOn(logger, "info");
      update.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(messages.check.checkConfigExists);
    });
    it("shows an error message if the config has not been found", async () => {
      const error = jest.spyOn(logger, "error");
      update.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(messages.check.checkConfigNotExists);
      expect(mockExit).toHaveBeenLastCalledWith(1);
    });
    it("shows a message if the outdated doc folder has been found", async () => {
      fs.mkdirSync(update.outdatedDocPath);
      const info = jest.spyOn(logger, "info");
      update.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(
        messages.check.checkOutdatedFolderExist
      );
    });
    it("shows a positive message if the outdated doc folder has not been found", async () => {
      const info = jest.spyOn(logger, "info");
      update.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(
        messages.check.checkOutdatedFolderNotExist
      );
    });
    it("shows an error message if both the outdated doc and a docs folder exist", async () => {
      fs.writeFileSync(update.configFilePath, "");
      fs.mkdirSync(update.outdatedDocPath);
      fs.mkdirSync(update.docsPath);
      const error = jest.spyOn(logger, "error");
      update.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(
        messages.update.outdatedDocFolderCannotBeRenamed
      );
      expect(mockExit).toHaveBeenLastCalledWith(1);
    });

    it("returns if no outdated doc folder exists", async () => {
      const info = jest.spyOn(logger, "info");
      update.updateOutdatedFolderName();
      expect(info).toHaveBeenCalledTimes(0);
    });
    it("shows a message after renaming the outdated doc folder to docs", async () => {
      fs.mkdirSync(update.outdatedDocPath);
      const info = jest.spyOn(logger, "info");
      update.updateOutdatedFolderName();
      expect(info).toHaveBeenCalledWith(
        messages.update.renamedOutdatedDocFolderToDocs
      );
      expect(fs.existsSync(update.docsPath)).toBeTruthy();
      expect(fs.existsSync(update.outdatedDocPath)).toBeFalsy();
    });

    it("shows a message after renaming the CODEOFCONDUCT.md file to CODE_OF_CONDUCT.md", async () => {
      fs.mkdir(update.docsPath);
      fs.writeFileSync(path.join(update.docsPath, "CODEOFCONDUCT.md"), "");
      const info = jest.spyOn(logger, "info");
      update.updateOutdatedFileNames();
      expect(info).toHaveBeenCalledWith(messages.update.renamedCodeOfConduct);
      expect(
        fs.existsSync(path.join(update.docsPath, "CODE_OF_CONDUCT.md"))
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(update.docsPath, "CODEOFCONDUCT.md"))
      ).toBeFalsy();
    });
    it("shows a message after renaming the GETSTARTED.md file to GET_STARTED.md", async () => {
      fs.mkdir(update.docsPath);
      fs.writeFileSync(path.join(update.docsPath, "GETSTARTED.md"), "");
      const info = jest.spyOn(logger, "info");
      update.updateOutdatedFileNames();
      expect(info).toHaveBeenCalledWith(messages.update.renamedGetStarted);
      expect(
        fs.existsSync(path.join(update.docsPath, "GET_STARTED.md"))
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(update.docsPath, "GETSTARTED.md"))
      ).toBeFalsy();
    });
    it("shows a message after renaming the PROJECTBACKGROUND.md file to PROJECT_BACKGROUND.md", async () => {
      fs.mkdir(update.docsPath);
      fs.writeFileSync(path.join(update.docsPath, "PROJECTBACKGROUND.md"), "");
      const info = jest.spyOn(logger, "info");
      update.updateOutdatedFileNames();
      expect(info).toHaveBeenCalledWith(
        messages.update.renamedProjectBackground
      );
      expect(
        fs.existsSync(path.join(update.docsPath, "PROJECT_BACKGROUND.md"))
      ).toBeTruthy();
      expect(
        fs.existsSync(path.join(update.docsPath, "PROJECTBACKGROUND.md"))
      ).toBeFalsy();
    });

    it("shows a positive message after the chapters update, when the readme exists", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      const success = jest.spyOn(logger, "success");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.updated);
    });
    it("shows a positive message after the chapters update, when the readme does not exist", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.configFilePath, "");
      fs.copySync(update.docsSourcePath, update.docsPath);
      const success = jest.spyOn(logger, "info");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.alreadyUpdated);
    });
    it("shows an info message if all the chapters are already installed", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.configFilePath, "");
      const success = jest.spyOn(logger, "success");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.updated);
    });
    it("copies the missing files into the docs folder", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      update.updateChapters();
      expect(update.docsFiles.length).toBe(update.docsSourceFiles.length);
    });
    it("creates the docs folder and copies the missing files into it", async () => {
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      update.updateChapters();
      expect(update.docsFiles.length).toBe(update.docsSourceFiles.length);
    });

    it("updates the version in the config file ", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.readmePath, "");
      const configFile = JSON.parse(
        fs.readFileSync(update.configFileSourcePath, {
          encoding: "utf8",
          flag: "r",
        })
      );
      fs.writeFileSync(
        update.configFilePath,
        JSON.stringify(configFile, null, 2)
      );

      update.packageVersion = "10.0.0";
      update.updateConfigFile();

      expect(
        JSON.parse(
          fs.readFileSync(update.configFilePath, {
            encoding: "utf8",
            flag: "r",
          })
        ).version
      ).toBe(update.packageVersion);
    });
    it("updates the version in the config file ", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.readmePath, "");
      update.packageVersion = "10.0.0";
      const error = jest.spyOn(logger, "error");
      update.updateConfigFile();
      expect(error).toHaveBeenCalledWith(
        messages.update.configFileNotExist.message
      );
    });
    it("updates the version in the config file ", async () => {
      fs.mkdirSync(update.docsPath);
      fs.writeFileSync(update.readmePath, "");
      const configFile = JSON.parse(
        fs.readFileSync(update.configFileSourcePath, {
          encoding: "utf8",
          flag: "r",
        })
      );
      fs.writeFileSync(
        update.configFilePath,
        JSON.stringify({ configFile, version: "2.0.0" }, null, 2)
      );

      update.packageVersion = "1.0.0";
      const info = jest.spyOn(logger, "info");
      update.updateConfigFile();

      expect(info).toHaveBeenCalledWith(messages.update.versionNotUpdated);
    });
  });
});
