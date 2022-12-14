import * as path from "path";
import * as fs from "fs-extra";
import { configuration } from "../shared/configuration";
import { Check } from "../commands";
import { logger } from "../Logger";
import mockFs from "mock-fs";
import {
  mockProcessExit,
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { messages } from "../shared/messages";
import chalk from "chalk";

let mockExit: jest.SpyInstance;
let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

let check: Check;
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
      "src/doc": mockFs.load(path.resolve("src/doc"), {
        lazy: false,
      }),
      "src/config": mockFs.load(path.resolve("src/config"), {
        lazy: false,
      }),
    });
    check = new Check({
      basePath: "fake_test_folder",
      ...configuration,
      moduleBasePath: path.join(".", "src"),
      packageVersion: "1.0.0",
    });
  });

  describe("check", () => {
    it("shows a positive message if the config has been found", async () => {
      fs.writeFileSync(check.configFilePath, "");
      const info = jest.spyOn(logger, "info");
      check.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(messages.check.checkConfigExists);
    });
    it("shows an error message if the config has not been found", async () => {
      const error = jest.spyOn(logger, "error");
      check.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(messages.check.checkConfigNotExists);
      expect(mockExit).toHaveBeenLastCalledWith(1);
    });
    it("shows a positive message if the documentation folder has been found", async () => {
      fs.mkdirSync(check.docPath);
      const info = jest.spyOn(logger, "info");
      check.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(messages.check.checkFolderExist);
    });
    it("shows an error message if the documentation folder has not been found", async () => {
      const error = jest.spyOn(logger, "error");
      check.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(messages.check.checkFolderNotExist);
      expect(mockExit).toHaveBeenLastCalledWith(1);
    });
    it("shows a positive message if the readme file has been found", async () => {
      fs.writeFileSync(check.readmePath, "");
      const info = jest.spyOn(logger, "info");
      check.preliminaryCheck();
      expect(info).toHaveBeenCalledWith(messages.check.readmeExists);
    });
    it("shows an error message if the readme file has not been found", async () => {
      const error = jest.spyOn(logger, "error");
      check.preliminaryCheck();
      expect(error).toHaveBeenCalledWith(messages.check.checkFolderNotExist);
      expect(mockExit).toHaveBeenLastCalledWith(1);
    });

    it("exit with code 0 if the preliminary checks are truthy", async () => {
      fs.mkdirSync(check.docPath);
      fs.writeFileSync(check.readmePath, "");
      fs.writeFileSync(check.configFilePath, "");
      check.run();
      expect(mockExit).toHaveBeenLastCalledWith(0);
    });

    it("shows the header message ", async () => {
      fs.mkdirSync(check.docPath);
      fs.writeFileSync(check.readmePath, "");
      fs.writeFileSync(check.configFilePath, "");
      check.checkChapters();
      expect(mockLog).toHaveBeenNthCalledWith(
        1,
        chalk.bold(messages.check.contentDocFolder.message)
      );
    });
  });
});
