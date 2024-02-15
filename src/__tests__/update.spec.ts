import * as path from "path";
import * as fs from "fs-extra";
import { Update } from "../commands";
import { logger } from "../Logger";
import mockFs from "mock-fs";
import {
  mockProcessStdout,
  mockProcessStderr,
  mockConsoleLog,
} from "jest-mock-process";
import { messages } from "../shared/messages";
import { ConfigFile } from "../interfaces";
import enquirer from "enquirer";

let mockStdout: jest.SpyInstance;
let mockStderr: jest.SpyInstance;
let mockLog: jest.SpyInstance;

jest.mock("enquirer");

const mockConfig: ConfigFile = {
  version: "1.0.0",
  documentationDirectory: "docs-test",
};

let update: Update;
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
    update = new Update(
      {
        basePath: "fake_test_folder",
      },
      mockConfig.version
    );
    // installation path during tests is relative to the uncompiled source files
    update.ownInstallationBasePath = path.join(__dirname, "../..");
  });

  describe("update", () => {
    describe("preliminaryCheck", () => {
      it("shows a positive message if the config has been found", async () => {
        fs.writeFileSync(update.configFilePath, "");
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.check.checkConfigExists);
      });
      it("shows an error message if the config has not been found", async () => {
        const error = jest.spyOn(logger, "error");
        await update.run();
        expect(error).toHaveBeenCalledWith(messages.check.checkConfigNotExists);
        expect(process.exitCode).toBe(1);
      });
      it("shows a message if the outdated doc folder has been found", async () => {
        fs.writeFileSync(update.configFilePath, "");
        fs.mkdirSync(update.outdatedDocPath);
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(
          messages.check.checkOutdatedFolderExist
        );
      });
      it("shows a positive message if the outdated doc folder has not been found", async () => {
        fs.writeFileSync(update.configFilePath, "");
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(
          messages.check.checkOutdatedFolderNotExist
        );
      });
    });

    describe("readConfigfile", () => {
      it("throws an error if the config file is empty", async () => {
        fs.writeFileSync(update.configFilePath, "");
        const error = jest.spyOn(logger, "error");
        await update.run();
        expect(error).toHaveBeenCalledWith(
          messages.update.configFileUnparsable
        );
        expect(process.exitCode).toBe(1);
      });
      it("shows a positive message if the config file contains a version", async () => {
        // This is required to run the code after reading the config file
        update.documentationDirectory = "docs";
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.configFileParsed);
      });
      it("shows a positive message if the config file contains version and documentationDirectory", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.configFileParsed);
      });
    });

    describe("updateOutdatedDirectoryName", () => {
      it("does nothing if the documenation directory has been successfully read from the config", async () => {
        update.documentationDirectory = "test";
        const result = await update.updateOutdatedDirectoryName();
        expect(result).toBeTruthy();
      });
      it("asks for the current documentation directory if none is in the config and no outdated doc directory exists", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest.fn().mockResolvedValue({ directory: "test" });
        fs.mkdirSync("fake_test_folder/test");
        const result = await update.updateOutdatedDirectoryName();
        expect(result).toBeTruthy();
      });
      it("throws and error if the documentation directory provided that should be written to the config does not exist", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest.fn().mockResolvedValue({ directory: "test" });
        const error = jest.spyOn(logger, "error");
        const result = await update.updateOutdatedDirectoryName();
        expect(error).toHaveBeenCalledWith(
          messages.update.documentationDirectoryNotExists("test")
        );
        expect(result).toBeFalsy();
      });
      it("throws an error if no directory is provided", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest.fn().mockResolvedValue({ directory: "" });
        fs.mkdirSync(update.outdatedDocPath);
        const error = jest.spyOn(logger, "error");
        await update.run();
        expect(fs.existsSync(update.outdatedDocPath)).toBeTruthy();
        expect(error).toHaveBeenCalledWith(
          messages.update.noDocumentationDirectoryProvided
        );
        expect(process.exitCode).toBe(1);
      });
      it("shows a message after renaming the outdated doc directory to docs", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest.fn().mockResolvedValue({ directory: "docs" });
        fs.mkdirSync(update.outdatedDocPath);
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(
          messages.update.renamedOutdatedDocFolder("docs")
        );
        expect(fs.existsSync(update.docsPath)).toBeTruthy();
        expect(fs.existsSync(update.outdatedDocPath)).toBeFalsy();
      });
      it("shows a message if the provided directory name is doc", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest.fn().mockResolvedValue({ directory: "doc" });
        fs.mkdirSync(update.outdatedDocPath);
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.keepDocDirectory);
        expect(fs.existsSync(update.docsPath)).toBeTruthy();
        expect(fs.existsSync(update.outdatedDocPath)).toBeTruthy();
      });
      it("shows an error if the provided directory already exists", async () => {
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        enquirer.prompt = jest
          .fn()
          .mockResolvedValue({ directory: "docs-test" });
        fs.mkdirSync(update.outdatedDocPath);
        fs.mkdir("fake_test_folder/docs-test");
        const error = jest.spyOn(logger, "error");
        await update.run();
        expect(error).toHaveBeenCalledWith(
          messages.update.documentationDirectoryExists("docs-test")
        );
        expect(fs.existsSync(update.outdatedDocPath)).toBeTruthy();
        expect(process.exitCode).toBe(1);
      });
    });

    describe("updateOutdatedFileNames", () => {
      it("shows a message after renaming the CODEOFCONDUCT.md file to CODE_OF_CONDUCT.md", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync("fake_test_folder/docs-test/CODEOFCONDUCT.md", "");
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.renamedCodeOfConduct);
        expect(
          fs.existsSync(path.join(update.docsPath, "CODE_OF_CONDUCT.md"))
        ).toBeTruthy();
        expect(
          fs.existsSync(path.join(update.docsPath, "CODEOFCONDUCT.md"))
        ).toBeFalsy();
      });
      it("shows a message after renaming the GETSTARTED.md file to GET_STARTED.md", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync("fake_test_folder/docs-test/GETSTARTED.md", "");
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.renamedGetStarted);
        expect(
          fs.existsSync(path.join(update.docsPath, "GET_STARTED.md"))
        ).toBeTruthy();
        expect(
          fs.existsSync(path.join(update.docsPath, "GETSTARTED.md"))
        ).toBeFalsy();
      });
      it("shows a message after renaming the PROJECTBACKGROUND.md file to PROJECT_BACKGROUND.md", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync("fake_test_folder/docs-test/PROJECTBACKGROUND.md", "");
        const info = jest.spyOn(logger, "info");
        await update.run();
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
    });

    describe("updateChapters", () => {
      it("shows a positive message after the chapters update, when the readme exists", async () => {
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync(update.readmePath, "");
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        const success = jest.spyOn(logger, "success");
        await update.run();
        expect(success).toHaveBeenCalledWith(messages.update.updated);
      });
      it("shows a positive message after the chapters update, when the readme does not exist", async () => {
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        fs.copySync(update.docsSourcePath, "fake_test_folder/docs-test");
        const success = jest.spyOn(logger, "info");
        await update.run();
        expect(success).toHaveBeenCalledWith(messages.update.alreadyUpdated);
      });
      it("shows an info message if all the chapters are already installed", async () => {
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        const success = jest.spyOn(logger, "success");
        await update.run();
        expect(success).toHaveBeenCalledWith(messages.update.updated);
      });
      it("copies the missing files into the docs folder", async () => {
        fs.mkdir("fake_test_folder/docs-test");
        fs.writeFileSync(update.readmePath, "");
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        await update.run();
        expect(update.findDocsFiles().length).toBe(
          update.findDocsSourceFiles().length
        );
      });
      it("creates the docs folder and copies the missing files into it", async () => {
        fs.writeFileSync(update.readmePath, "");
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        await update.run();
        expect(update.findDocsFiles().length).toBe(
          update.findDocsSourceFiles().length
        );
      });
    });

    describe("updateConfigFile", () => {
      it("updates the version in the config file", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        update.packageVersion = "10.0.0";
        await update.run();
        expect(
          JSON.parse(
            fs.readFileSync(update.configFilePath, {
              encoding: "utf8",
              flag: "r",
            })
          ).version
        ).toBe(update.packageVersion);
      });
      it("shows an error if no config file exists", async () => {
        const error = jest.spyOn(logger, "error");
        await update.updateConfigFile();
        expect(error).toHaveBeenCalledWith(
          messages.update.configFileNotExist.message
        );
      });
      it("shows a message if the version in the config file is the same as the current package version", async () => {
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        update.packageVersion = "1.0.0";
        const info = jest.spyOn(logger, "info");
        await update.run();
        expect(info).toHaveBeenCalledWith(messages.update.versionNotUpdated);
      });
      it("adds the documentation directory to the config file if it doesn't exist already", async () => {
        update.documentationDirectory = "docs-test";
        const oldConfig = { ...mockConfig };
        // @ts-expect-error -- purposefully testing bad data
        delete oldConfig.documentationDirectory;
        fs.writeFileSync(update.configFilePath, JSON.stringify(oldConfig));
        await update.run();
        expect(
          JSON.parse(
            fs.readFileSync(update.configFilePath, {
              encoding: "utf8",
              flag: "r",
            })
          ).documentationDirectory
        ).toBe(update.documentationDirectory);
      });
      it("doesn't change the documentation directory if it already exists in the config", async () => {
        update.documentationDirectory = "other-docs";
        fs.writeFileSync(update.configFilePath, JSON.stringify(mockConfig));
        await update.run();
        expect(
          JSON.parse(
            fs.readFileSync(update.configFilePath, {
              encoding: "utf8",
              flag: "r",
            })
          ).documentationDirectory
        ).toBe("docs-test");
      });
    });
  });
});
