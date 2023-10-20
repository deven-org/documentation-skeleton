import * as path from "path";

export const configuration = {
  // __dirname is equivalent to the installation path of dist/main.umd.js.
  // This way the commands can be executed locally as well with "npm run self:install/check/update".
  moduleBasePath: path.join(__dirname, "..", "src"),
  docFolderName: "doc",
  rootFolderName: "root",
  docBackupFolderName: "_doc",
  configFilename: "deven-skeleton-install.config.json",
};
