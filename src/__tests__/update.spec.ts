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
import { version } from "prettier";

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

    it("shows a positive message after the chapters update, when the readme exists", async () => {
      fs.mkdirSync(update.docPath);
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      const success = jest.spyOn(logger, "success");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.updated);
    });

    it("shows a positive message after the chapters update, when the readme does not exist", async () => {
      fs.mkdirSync(update.docPath);
      fs.writeFileSync(update.configFilePath, "");
      fs.copySync(update.docSourcePath, update.docPath);
      const success = jest.spyOn(logger, "info");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.alreadyUpdated);
    });

    it("shows an info message if all the chapters are already installed", async () => {
      fs.mkdirSync(update.docPath);
      fs.writeFileSync(update.configFilePath, "");
      const success = jest.spyOn(logger, "success");
      update.updateChapters();
      expect(success).toHaveBeenCalledWith(messages.update.updated);
    });

    it("copies the missing files into the doc folder", async () => {
      fs.mkdirSync(update.docPath);
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      update.updateChapters();
      expect(update.docFiles.length).toBe(update.docSourceFiles.length);
    });

    it("creates the doc folder and copies the missing files into it", async () => {
      fs.writeFileSync(update.readmePath, "");
      fs.writeFileSync(update.configFilePath, "");
      update.updateChapters();
      expect(update.docFiles.length).toBe(update.docSourceFiles.length);
    });

    it("updates the version in the config file ", async () => {
      fs.mkdirSync(update.docPath);
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
      fs.mkdirSync(update.docPath);
      fs.writeFileSync(update.readmePath, "");
      update.packageVersion = "10.0.0";
      const error = jest.spyOn(logger, "error");
      update.updateConfigFile();
      expect(error).toHaveBeenCalledWith(
        messages.update.configFileNotExist.message
      );
    });

    it("updates the version in the config file ", async () => {
      fs.mkdirSync(update.docPath);
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
