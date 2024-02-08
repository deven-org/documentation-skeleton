import * as path from "path";
import * as fs from "fs-extra";
import { Check } from "../commands";
import { logger } from "../Logger";
import mockFs from "mock-fs";
import {
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { messages } from "../shared/messages";
import chalk from "chalk";
import { ConfigFile } from "../interfaces";

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

const mockConfig: ConfigFile = {
  version: "1.0.0",
  documentationDirectory: "docs-test",
};

let check: Check;
describe("deven-cli", () => {
  afterEach(() => {
    mockFs.restore();
    mockStdout.mockRestore();
    mockStderr.mockRestore();
    mockLog.mockRestore();
    // reset exit code when command fails
    process.exitCode = 0;
    jest.clearAllMocks();
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
    check = new Check({ basePath: "fake_test_folder" }, mockConfig.version);
    // installation path during tests is relative to the uncompiled source files
    check.ownInstallationBasePath = path.join(__dirname, "../..");
  });

  describe("check", () => {
    it("shows a positive message if the config has been found", async () => {
      fs.writeFileSync(check.configFilePath, "");
      const info = jest.spyOn(logger, "info");
      await check.run();
      expect(info).toHaveBeenCalledWith(messages.check.checkConfigExists);
    });
    it("shows an error message if the config has not been found", async () => {
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(messages.check.checkConfigNotExists);
      expect(process.exitCode).toBe(1);
    });

    it("shows an error message if the config could not be parsed", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        ""
      );
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(
        messages.check.checkConfigFileReadable(
          "fake_test_folder/deven-skeleton-install.config.json"
        )
      );
      expect(process.exitCode).toBe(1);
    });

    it("shows an error message if the config version is malformed", async () => {
      const badConfig = { ...mockConfig, version: 2 };
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(badConfig)
      );
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(
        messages.check.checkConfigFieldVersionMissing
      );
      expect(process.exitCode).toBe(1);
    });

    it("shows an error message if the config version doesn't match the installed version", async () => {
      const oldConfig = { ...mockConfig, version: "0.9.0" };
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(oldConfig)
      );
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(
        messages.check.checkConfigFieldVersionMismatch("0.9.0", "1.0.0")
      );
      expect(process.exitCode).toBe(1);
    });

    it("shows an error message if the config doc dir is missing", async () => {
      const badConfig = { ...mockConfig };
      // @ts-expect-error -- purposefully testing bad data
      delete badConfig.documentationDirectory;
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(badConfig)
      );
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(
        messages.check.checkConfigFieldDocDirMissing
      );
      expect(process.exitCode).toBe(1);
    });

    it("shows a positive message that the config is valid and doc dir path has been determined", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );

      const info = jest.spyOn(logger, "info");
      await check.run();
      expect(info).toHaveBeenCalledWith(messages.check.checkConfigFileValid);
      expect(info).toHaveBeenCalledWith(
        messages.check.checkDocDirPathFound(
          `fake_test_folder/${mockConfig.documentationDirectory}`
        )
      );
    });

    it("shows a positive message if the documentation folder has been found", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      fs.mkdirSync(`fake_test_folder/${mockConfig.documentationDirectory}`);
      const info = jest.spyOn(logger, "info");
      await check.run();
      expect(info).toHaveBeenCalledWith(messages.check.checkFolderExist);
    });

    it("shows an error message if the documentation folder has not been found", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(messages.check.checkFolderNotExist);
      expect(process.exitCode).toBe(1);
    });
    it("shows a positive message if the readme file has been found", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      fs.mkdirSync(`fake_test_folder/${mockConfig.documentationDirectory}`);
      fs.writeFileSync("fake_test_folder/README.md", "");

      const info = jest.spyOn(logger, "info");
      await check.run();
      expect(info).toHaveBeenCalledWith(messages.check.readmeExists);
    });
    it("shows an error message if the readme file has not been found", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      fs.mkdirSync(`fake_test_folder/${mockConfig.documentationDirectory}`);
      const error = jest.spyOn(logger, "error");
      await check.run();
      expect(error).toHaveBeenCalledWith(messages.check.checkFolderNotExist);
      expect(process.exitCode).toBe(1);
    });

    it("exit with code 0 if all checks succeed", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      fs.mkdirSync(`fake_test_folder/${mockConfig.documentationDirectory}`);
      fs.writeFileSync("fake_test_folder/README.md", "");
      await check.run();
      expect(process.exitCode).toBe(0);
    });

    it("shows the header message ", async () => {
      fs.writeFileSync(
        "fake_test_folder/deven-skeleton-install.config.json",
        JSON.stringify(mockConfig)
      );
      fs.mkdirSync(`fake_test_folder/${mockConfig.documentationDirectory}`);
      fs.writeFileSync("fake_test_folder/README.md", "");
      await check.run();
      expect(mockLog).toHaveBeenNthCalledWith(
        1,
        chalk.bold(messages.check.contentDocsFolder.message)
      );
    });
  });
});
