import * as path from "path";
import * as fs from "fs-extra";
import { BaseCommand } from "../commands/command";
import mockFs from "mock-fs";
import {
  mockProcessExit,
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";

let mockExit: jest.SpyInstance;
let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

let command: BaseCommand;
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
    command = new BaseCommand(
      {
        basePath: "fake_test_folder",
      },
      "1.0.0"
    );
    // Written as a relative path to easily check outcomes against expected values
    command.ownInstallationBasePath = ".";
  });

  describe("command", () => {
    it("getDocsFilePath returns the correct path", async () => {
      command.documentationDirectory = "docs";
      expect(command.getDocsFilePath("test.md")).toBe(
        "fake_test_folder/docs/test.md"
      );
    });
    it("provides the right docs path (<root>/docs)", async () => {
      command.documentationDirectory = "docs";
      expect(command.docsPath).toBe("fake_test_folder/docs");
    });
    it("throws an error for docsPath if no documentation directory is set", async () => {
      expect(() => command.docsPath).toThrowError(
        "#documentationDirectory has not been set yet. Please ensure that it has been set before trying to access it."
      );
    });
    it("provides the right outdated doc path (<root>/doc)", async () => {
      expect(command.outdatedDocPath).toBe("fake_test_folder/doc");
    });
    it("provides the right readme path (<root>/README.md)", async () => {
      expect(command.readmePath).toBe("fake_test_folder/README.md");
    });
    it("provides the right readme backup path (<root>/_README)", async () => {
      expect(command.readmeBackupPath).toBe("fake_test_folder/_README.md");
    });
    it("provides the right readme source path (src/root/README)", async () => {
      expect(command.readmeSourcePath).toBe("src/root/README.md");
    });
    it("provides the right config source path (src/root/deven-skeleton-install.config.json)", async () => {
      expect(command.configFileSourcePath).toBe(
        "src/root/deven-skeleton-install.config.json"
      );
    });
    it("return false when the config file doesn't exist", async () => {
      expect(command.existsConfigFile()).toBeFalsy();
    });
    it("return true when the config file exists", async () => {
      fs.writeFileSync(command.configFilePath, "");
      expect(command.existsConfigFile()).toBeTruthy();
    });
    it("return false when the outdated doc folder doesn't exist", async () => {
      expect(command.existsOutdatedDocFolder()).toBeFalsy();
    });
    it("return true when the outdated doc folder exists", async () => {
      fs.mkdirSync(command.outdatedDocPath);
      expect(command.existsOutdatedDocFolder()).toBeTruthy();
    });
    it("return the list of all the available chapters (except the readme)", async () => {
      expect(command.findDocsSourceFiles().length).toBe(8);
    });
    it("return the list of all local chapters (except the readme)", async () => {
      command.documentationDirectory = "docs";
      fs.copySync(command.docsSourcePath, command.docsPath);
      expect(command.findDocsFiles().length).toBe(8);
    });
    it("return the list of all the chapters", async () => {
      command.documentationDirectory = "docs";
      fs.copySync(command.docsSourcePath, command.docsPath);
      expect(command.coverage()).toBe(100);
      fs.rmSync(path.join(command.docsPath, "CONTRIBUTE.md"));
      fs.rmSync(path.join(command.docsPath, "TESTING.md"));
      expect(command.coverage()).toBe(75);
    });
    it("throws an error if no steps to run are available", async () => {
      command.steps = null;
      let caughtError = "";
      try {
        await command.run();
      } catch (error: unknown) {
        caughtError = (error as Error).message;
      }
      expect(caughtError).toBe("Command subclass must specify steps");
    });
  });
});
