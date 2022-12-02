import * as path from "path";
import * as fs from "fs-extra";
import { configuration } from "../shared/configuration";
import { Command } from "../commands/command";
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

let command: Command;
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
    command = new Command({
      basePath: "fake_test_folder",
      ...configuration,
      moduleBasePath: path.join(".", "src"),
      packageVersion: "1.0.0",
    });
  });

  describe("command", () => {
    it("provides the right doc path (<root>/doc)", async () => {
      expect(command.docPath).toBe("fake_test_folder/doc");
    });
    it("provides the right readme path (<root>/README.md)", async () => {
      expect(command.readmePath).toBe("fake_test_folder/README.md");
    });
    it("provides the right doc backup path (<root>/_doc)", async () => {
      expect(command.docBackupPath).toBe("fake_test_folder/_doc");
    });
    it("provides the right readme backup path (<root>/_README)", async () => {
      expect(command.readmeBackupPath).toBe("fake_test_folder/_README.md");
    });
    it("provides the right readme source path (src/doc/README)", async () => {
      expect(command.readmeSourcePath).toBe("src/doc/README.md");
    });
    it("provides the right readme source path (src/config/deven-skeleton-install.config.json)", async () => {
      expect(command.configFileSourcePath).toBe(
        "src/config/deven-skeleton-install.config.json"
      );
    });
    it("return false when the config file doesn't exist", async () => {
      expect(command.existsConfigFile).toBeFalsy();
    });
    it("return true when the config file exists", async () => {
      fs.writeFileSync(command.configFilePath, "");
      expect(command.existsConfigFile).toBeTruthy();
    });
    it("return the list of all the available chapters (except the readme)", async () => {
      expect(command.docSourceFiles.length).toBe(8);
    });
    it("return the list of all local chapters (except the readme)", async () => {
      fs.copySync(command.docSourcePath, command.docPath);
      expect(command.docFiles.length).toBe(8);
    });
    it("return the list of all the chapters", async () => {
      fs.copySync(command.docSourcePath, command.docPath);
      expect(command.coverage).toBe(100);
      fs.rmSync(path.join(command.docPath, "CONTRIBUTE.md"));
      fs.rmSync(path.join(command.docPath, "TESTING.md"));
      expect(command.coverage).toBe(75);
    });
  });
});
