import * as path from "path";
import * as fs from "fs-extra";
import enquirer from "enquirer";
import { Install } from "../commands";
import mockFs from "mock-fs";
import {
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { logger } from "../Logger";
import { messages } from "../shared/messages";

jest.mock("enquirer");

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

let install: Install;
describe("deven-cli", () => {
  afterEach(() => {
    mockFs.restore();
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    mockLog.mockRestore();
    jest.clearAllMocks();
    // reset exit code if command failed
    process.exitCode = 0;
  });
  beforeEach(() => {
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
    install = new Install(
      {
        basePath: "fake_test_folder",
        documentationDirectory: undefined,
      },
      "1.0.0"
    );
    // installation path during tests is relative to the uncompiled source files
    install.ownInstallationBasePath = path.join(__dirname, "../..");
  });

  describe("install", () => {
    it("fails the preliminary check because no documentation directory was provided", async () => {
      enquirer.prompt = jest.fn().mockResolvedValue({ directory: "" });
      const error = jest.spyOn(logger, "error");
      await install.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(
        messages.install.noDocumentationDirectoryProvided
      );
    });

    it("sets the documentation directory to the provided value if valid", async () => {
      enquirer.prompt = jest.fn().mockResolvedValue({ directory: "docs-test" });
      await install.preliminaryCheck();
      expect(install.documentationDirectory).toBe("docs-test");
    });

    it("fails the preliminary check because the provided documentation directory already exist", async () => {
      install.documentationDirectory = "docs";
      fs.mkdirSync("fake_test_folder/docs");
      const error = jest.spyOn(logger, "error");
      await install.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(
        messages.install.documentationDirectoryExists("docs")
      );
    });

    it("clones the source docs folder into the destination docs folder", async () => {
      install.documentationDirectory = "docs";
      await install.run();
      expect(fs.existsSync(install.docsPath)).toBeTruthy();
      expect(JSON.stringify(fs.readdirSync(install.docsPath))).toBe(
        JSON.stringify(fs.readdirSync(install.docsSourcePath))
      );
    });

    it("doesn't clone the source docs folder if the docs folder already exists", async () => {
      install.documentationDirectory = "docs";
      fs.mkdirSync("fake_test_folder/docs");
      const error = jest.spyOn(logger, "error");
      await install.cloneDocsFolder();
      expect(error).toHaveBeenCalledWith(messages.install.docsFolderExists);
    });

    it("clones the source config file into the destination folder", async () => {
      install.documentationDirectory = "docs";
      await install.run();
      expect(fs.existsSync(install.configFilePath)).toBeTruthy();
    });

    it("clones the README file into the destination folder", async () => {
      enquirer.prompt = jest.fn().mockResolvedValue({ confirm: true });
      install.documentationDirectory = "docs";
      await install.run();
      expect(fs.existsSync(install.readmePath)).toBeTruthy();
    });

    it("doesn't rename an already existing README file if the prompt is answered with no", async () => {
      fs.writeFileSync(install.readmePath, "");
      enquirer.prompt = jest.fn().mockResolvedValue({ confirm: false });
      install.documentationDirectory = "docs";
      await install.run();
      expect(fs.existsSync(install.readmeBackupPath)).toBeFalsy();
    });

    it("fails the preliminary check because the config file exists", async () => {
      install.documentationDirectory = "docs";
      fs.writeFileSync(install.configFilePath, "");
      const error = jest.spyOn(logger, "error");
      await install.run();
      expect(error).toHaveBeenCalled();
    });

    it("fails the preliminary check because the readme and backup readme exist", async () => {
      install.documentationDirectory = "docs";
      fs.writeFileSync(install.readmePath, "");
      fs.writeFileSync(install.readmeBackupPath, "");
      const error = jest.spyOn(logger, "error");
      await install.run();
      expect(error).toHaveBeenCalledWith(messages.install.checkReadmeExists);
    });

    it("shows an error if the backup README already exists when trying to backup the existing README", async () => {
      fs.writeFileSync(install.readmePath, "");
      fs.writeFileSync(install.readmeBackupPath, "");
      const error = jest.spyOn(logger, "error");
      await install.backupReadme();
      expect(error).toHaveBeenCalledWith(messages.install.backupReadmeExists);
    });

    it("shows a positive message if the already existing README could be backuped", async () => {
      fs.writeFileSync(install.readmePath, "");
      const info = jest.spyOn(logger, "info");
      await install.backupReadme();
      expect(info).toHaveBeenCalledWith(messages.install.readmeBackupSuccesful);
      expect(fs.existsSync(install.readmeBackupPath)).toBeTruthy();
      expect(fs.existsSync(install.readmePath)).toBeFalsy();
    });

    it("shows an error if trying to clone the README if it already exists", async () => {
      fs.writeFileSync(install.readmePath, "");
      const error = jest.spyOn(logger, "error");
      await install.cloneReadme();
      expect(error).toHaveBeenCalledWith(messages.install.readmeExists);
    });

    it("shows an error if trying to create the config if it already exists", async () => {
      fs.writeFileSync(install.configFilePath, "");
      const error = jest.spyOn(logger, "error");
      await install.createsConfigFile();
      expect(error).toHaveBeenCalledWith(messages.install.configFileExists);
    });
  });
});
