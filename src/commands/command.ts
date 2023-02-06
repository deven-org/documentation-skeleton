import * as path from "path";
import * as fs from "fs-extra";

export type Config = {
  basePath: string;
  docFolderName: string;
  docBackupFolderName: string;
  moduleBasePath: string;
  configFilename: string;
  rootFolderName: string;
  packageVersion: string;
};

export class Command {
  private basePath: string;
  private docFolderName: string;
  private docBackupFolderName: string;
  private moduleBasePath: string;
  private configFilename: string;
  private rootFolderName: string;
  public packageVersion: string;

  get docPath(): string {
    return path.join(this.basePath, this.docFolderName);
  }

  get readmePath(): string {
    return path.join(this.basePath, "README.md");
  }

  get docBackupPath(): string {
    return path.join(this.basePath, this.docBackupFolderName);
  }

  get readmeBackupPath(): string {
    return path.join(this.basePath, "_README.md");
  }

  get docSourcePath(): string {
    return path.join(this.moduleBasePath, this.docFolderName);
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

  get existsDocFolder(): boolean {
    return fs.existsSync(this.docPath);
  }

  get existsReadme(): boolean {
    return fs.existsSync(this.readmePath);
  }

  get existsBackupDocFolder(): boolean {
    return fs.existsSync(this.docBackupPath);
  }

  get existsBackupReadme(): boolean {
    return fs.existsSync(this.readmeBackupPath);
  }

  get existsConfigFile(): boolean {
    return fs.existsSync(this.configFilePath);
  }

  get docSourceFiles(): string[] {
    return fs.readdirSync(this.docSourcePath);
  }

  get docFiles(): string[] {
    return fs.readdirSync(this.docPath);
  }

  get coverage(): number {
    const found = this.docSourceFiles.filter((x) => this.docFiles.includes(x));
    return (found.length / this.docSourceFiles.length) * 100;
  }

  constructor(config: Config) {
    this.basePath = config.basePath || path.normalize(".");
    this.docFolderName = config.docFolderName;
    this.docBackupFolderName = config.docBackupFolderName;
    this.moduleBasePath = config.moduleBasePath;
    this.configFilename = config.configFilename;
    this.rootFolderName = config.rootFolderName;
    this.packageVersion = config.packageVersion;
  }
}
