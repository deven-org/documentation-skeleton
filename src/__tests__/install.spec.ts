import * as path from "path";
import * as fs from "fs-extra";
import enquirer from "enquirer";
import { configuration } from "../shared/configuration";
import { Install } from "../commands";
import mockFs from "mock-fs";
import {
  mockProcessExit,
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { logger } from "../Logger";
import { messages } from "../shared/messages";

jest.mock("enquirer");

let mockExit: jest.SpyInstance;
let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

let install: Install;
describe("deven-cli", () => {
  afterEach(() => {
    mockFs.restore();
    mockExit.mockRestore();
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    mockLog.mockRestore();
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
    enquirer.prompt = jest.fn().mockResolvedValue({ confirm: true });
    install = new Install(
      {
        basePath: "fake_test_folder",
      },
      "1.0.0"
    );
    // installation path during tests is relative to the uncompiled source files
    install.ownInstallationBasePath = path.join(__dirname, "../..");
  });

  describe("install", () => {
    it("renames the folder if it already exists during the installation", async () => {
      fs.writeFileSync(install.docsPath, "");
      await install.run();
      expect(fs.existsSync(install.docsBackupPath)).toBeTruthy();
    });

    it("clones the source docs folder into the destination docs folder", async () => {
      await install.run();
      expect(fs.existsSync(install.docsPath)).toBeTruthy();
      expect(JSON.stringify(fs.readdirSync(install.docsPath))).toBe(
        JSON.stringify(fs.readdirSync(install.docsSourcePath))
      );
    });

    it("clones the source config file into the destination folder", async () => {
      await install.run();
      expect(fs.existsSync(install.configFilePath)).toBeTruthy();
    });

    it("clones the README file into the destination folder", async () => {
      await install.run();
      expect(fs.existsSync(install.readmePath)).toBeTruthy();
    });

    it("fails the preliminary check because the config file exists", async () => {
      fs.writeFileSync(install.configFilePath, "");
      const error = jest.spyOn(logger, "error");
      await install.run();
      expect(error).toHaveBeenCalled();
    });

    it("fails the preliminary check because the docs and docs backup folder exist", async () => {
      fs.mkdirSync(install.docsPath);
      fs.mkdirSync(install.docsBackupPath);
      const error = jest.spyOn(logger, "error");
      await install.run();
      expect(error).toHaveBeenCalledWith(messages.install.checkFolderExist);
    });

    it("fails the preliminary check because the readme and backup readme exist", async () => {
      fs.writeFileSync(install.readmePath, "");
      fs.writeFileSync(install.readmeBackupPath, "");
      const error = jest.spyOn(logger, "error");
      await install.run();
      expect(error).toHaveBeenCalledWith(messages.install.checkFolderExist);
    });
  });
});
