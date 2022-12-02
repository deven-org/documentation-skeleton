import * as path from "path";

export const configuration = {
  moduleBasePath: path.join(
    ".",
    "node_modules",
    "deven-documentation-skeleton",
    "src"
  ),
  docFolderName: "doc",
  configFolderName: "config",
  docBackupFolderName: "_doc",
  configFilename: "deven-skeleton-install.config.json",
};
