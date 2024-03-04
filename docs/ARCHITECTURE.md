# Architecture

The documentation skeleton can be integrated in multiple ways into other projects, the recommended way is to add it as a devDependency.

As an npm package the project has also multiple commands that can be executed.

In this document one can find more information about the npm package and command architecture.

## Content <!-- omit in toc -->

- [Architecture](#architecture)
  - [Overall Structure](#overall-structure)
    - [Entry script](#entry-script)
    - [The commands](#the-commands)
    - [Shared](#shared)
  - [Technical Decisions](#technical-decisions)

## Overall Structure

The project consists of multiple parts, in the contribution guide one can find an overview of the [file structure](/docs/CONTRIBUTE.md#📁-file-structure).

### Entry script

The entry script can be found under `bin/index.js`.

This script is a wrapper for the commands implemented under `src/commands`.

Because the script is a wrapper it was decided to leave it in plain JavaScript.

The script imports/requires the commands from the UMD bundle out of the build folder.

The script checks the call parameters and depended on them calls one of the commands.

### The commands

The documentation skeleton project has three different commands to support with your own documentation structure.

The commands are written in TypeScript and with `microbundle` bundled into a UMD module.

Each command has a number of tests, which can be found in the directory `__tests__`.

### Shared

The `shared` folder contains the messages that are used by the different commands to communicate with the user.

## Technical Decisions

The project is bundled to a UMD module with the help of `microbundle`.

As this is an open source project we aim for a test coverage of >90%, experience showed that it good to cover as much as possible with tests.

We use [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/) and enforce them with a hook that checks the commit message after creation with [commitlint](https://github.com/conventional-changelog/commitlint)

The `pre-push` hook is used to run linting ([ESLint](https://eslint.org/)), formatting ([prettier](https://prettier.io/)) and testing ([Jest](https://jestjs.io/)).
If any part of the hook is failing the code can not be pushed before the required changes are implemented.

If a work-in-progress should be pushed one can use the `--no-verify` flag on the push command but this bypass should only be used if needed.

The package uses itself for the documentation, therefore we have multiple `self*` commands.
To use those commands a build needs to be done beforehand as it is calling the bundled code.

The used node version is 18, due to a problem with the `mock-fs` dependency. The dependency is not compatible with node 20 yet.
Due to that we set the required node version between 16.20.2 and 20.0.0.

To make sure that the whole package can still be used by projects that use node >= 20.0.0 we delete the `engines` key out of the `package.json` before a publish happens and restore it afterwards again (see `prepublishOnly` and `postpublish` in `package.json`).