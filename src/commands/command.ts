import * as path from "path";
import * as fs from "fs-extra";

export type Config = {
  basePath: string;
  docsFolderName: string;
  outdatedDocFolderName: string;
  docsBackupFolderName: string;
  moduleBasePath: string;
  configFilename: string;
  rootFolderName: string;
  packageVersion: string;
};

export class Command {
  private basePath: string;
  private docsFolderName: string;
  private outdatedDocFolderName: string;
  private docsBackupFolderName: string;
  private moduleBasePath: string;
  private configFilename: string;
  private rootFolderName: string;
  public packageVersion: string;

  public getDocsFilePath(filename: string): string {
    return path.join(this.docsPath, filename);
  }

  get docsPath(): string {
    return path.join(this.basePath, this.docsFolderName);
  }

  get outdatedDocPath(): string {
    return path.join(this.basePath, this.outdatedDocFolderName);
  }

  get readmePath(): string {
    return path.join(this.basePath, "README.md");
  }

  get docsBackupPath(): string {
    return path.join(this.basePath, this.docsBackupFolderName);
  }

  get readmeBackupPath(): string {
    return path.join(this.basePath, "_README.md");
  }

  get docsSourcePath(): string {
    return path.join(this.moduleBasePath, this.docsFolderName);
  }

  get readmeSourcePath(): string {
    return path.join(this.moduleBasePath, this.rootFolderName, "README.md");
  }

  get configFileSourcePath(): string {
    return path.join(
      this.moduleBasePath,
      this.rootFolderName,
      this.configFilename
    );
  }

  get configFilePath(): string {
    return path.join(this.basePath, this.configFilename);
  }

  get existsDocsFolder(): boolean {
    return fs.existsSync(this.docsPath);
  }

  get existsOutdatedDocFolder(): boolean {
    return fs.existsSync(this.outdatedDocPath);
  }

  get existsReadme(): boolean {
    return fs.existsSync(this.readmePath);
  }

  get existsBackupDocsFolder(): boolean {
    return fs.existsSync(this.docsBackupPath);
  }

  get existsBackupReadme(): boolean {
    return fs.existsSync(this.readmeBackupPath);
  }

  get existsConfigFile(): boolean {
    return fs.existsSync(this.configFilePath);
  }

  get docsSourceFiles(): string[] {
    return fs.readdirSync(this.docsSourcePath);
  }

  get docsFiles(): string[] {
    return fs.readdirSync(this.docsPath);
  }

  get coverage(): number {
    const found = this.docsSourceFiles.filter((x) =>
      this.docsFiles.includes(x)
    );
    return (found.length / this.docsSourceFiles.length) * 100;
  }

  constructor(config: Config) {
    this.basePath = config.basePath || path.normalize(".");
    this.docsFolderName = config.docsFolderName;
    this.outdatedDocFolderName = config.outdatedDocFolderName;
    this.docsBackupFolderName = config.docsBackupFolderName;
    this.moduleBasePath = config.moduleBasePath;
    this.configFilename = config.configFilename;
    this.rootFolderName = config.rootFolderName;
    this.packageVersion = config.packageVersion;
  }
}
