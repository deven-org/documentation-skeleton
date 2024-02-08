import * as path from "path";
import * as fs from "fs-extra";

export type BaseCliParams = {
  basePath: string | undefined;
};

export class BaseCommand<CliParams extends BaseCliParams = BaseCliParams> {
  // __dirname is equivalent to the installation path of dist/main.umd.js.
  // This way the commands can be executed locally as well with "npm run self:install/check/update".
  // Exposed for overwriting in tests, since the behaviour in tests is different.
  ownInstallationBasePath = path.join(__dirname, "..");

  static #rootSourceFolder = "src/root";
  static #docsSourceFolder = "src/docs";

  static #outdatedDocFolderName = "doc";
  static #configFilename = "deven-skeleton-install.config.json";

  documentationDirectory: string | null = null;
  #basePath: string;
  packageVersion: string;

  steps: null | Array<() => Promise<boolean>> = null;

  constructor(params: CliParams, packageVersion: string) {
    this.#basePath = params.basePath || path.normalize(".");
    this.packageVersion = packageVersion;
  }

  getDocsFilePath(filename: string): string {
    return path.join(this.docsPath, filename);
  }

  get docsPath(): string {
    if (this.documentationDirectory === null) {
      throw new Error(
        "#documentationDirectory has not been set yet. Please ensure that it has been set before trying to access it."
      );
    }

    return path.join(this.#basePath, this.documentationDirectory);
  }

  get outdatedDocPath(): string {
    return path.join(this.#basePath, BaseCommand.#outdatedDocFolderName);
  }

  get readmePath(): string {
    return path.join(this.#basePath, "README.md");
  }

  get readmeBackupPath(): string {
    return path.join(this.#basePath, "_README.md");
  }

  get docsSourcePath(): string {
    return path.join(
      this.ownInstallationBasePath,
      BaseCommand.#docsSourceFolder
    );
  }

  get readmeSourcePath(): string {
    return path.join(
      this.ownInstallationBasePath,
      BaseCommand.#rootSourceFolder,
      "README.md"
    );
  }

  get configFileSourcePath(): string {
    return path.join(
      this.ownInstallationBasePath,
      BaseCommand.#rootSourceFolder,
      BaseCommand.#configFilename
    );
  }

  get configFilePath(): string {
    return path.join(this.#basePath, BaseCommand.#configFilename);
  }

  existsDocsFolder(): boolean {
    return fs.existsSync(this.docsPath);
  }

  existsOutdatedDocFolder(): boolean {
    return fs.existsSync(this.outdatedDocPath);
  }

  existsReadme(): boolean {
    return fs.existsSync(this.readmePath);
  }

  existsBackupReadme(): boolean {
    return fs.existsSync(this.readmeBackupPath);
  }

  existsConfigFile(): boolean {
    return fs.existsSync(this.configFilePath);
  }

  findDocsSourceFiles(): string[] {
    return fs.readdirSync(this.docsSourcePath);
  }

  findDocsFiles(): string[] {
    return fs.readdirSync(this.docsPath);
  }

  coverage(): number {
    const found = this.findDocsSourceFiles().filter((x) =>
      this.findDocsFiles().includes(x)
    );
    return (found.length / this.findDocsSourceFiles().length) * 100;
  }

  async run(): Promise<void> {
    if (!this.steps) {
      throw new Error("Command subclass must specify steps");
    }

    for (const step of this.steps) {
      const success = await step();

      if (!success) {
        process.exitCode = 1;
        return;
      }
    }
  }
}
