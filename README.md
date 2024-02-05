# Deven Documentation Skeleton

![Render of the terminal](https://github.com/deven-org/documentation-skeleton/raw/main/assets/render.gif)

[![Issues](https://img.shields.io/github/issues-raw/deven-org/documentation-skeleton.svg?maxAge=25000)](https://github.com/deven-org/documentation-skeleton/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/deven-org/documentation-skeleton.svg?style=flat)](https://github.com/deven-org/documentation-skeleton/pulls)
[![Code of Conduct](https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat)](https://github.com/deven-org/documentation-skeleton/blob/main/doc/CODE_OF_CONDUCT.md)  
[![GitHub contributors](https://img.shields.io/github/contributors/deven-org/documentation-skeleton.svg?style=flat)](https://github.com/deven-org/documentation-skeleton/)
![Coverage](https://img.shields.io/badge/Code%20Coverage-83%25-success?style=flat)

`deven-documentation-skeleton` is built to work with NodeJS. It clones the deven's documentation skeleton in your project, provides information about the documentation coverage and help to you identify and clone the missing chapters.

## :information_source: Table of contents

- [Deven Documentation Skeleton](#deven-documentation-skeleton)
  - [:information_source: Table of contents](#information_source-table-of-contents)
- [:star: Introduction](#star-introduction)
  - [Goals](#goals)
  - [:file_folder: Documentation Structure](#file_folder-documentation-structure)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [:rocket: How to use it](#rocket-how-to-use-it)
    - [1. Install](#1-install)
    - [2. Check](#2-check)
    - [3. Update](#3-update)
- [:white_check_mark: How to test](#white_check_mark-how-to-test)
- [:v: Contribute](#v-contribute)
- [:bug: Bugs and Issues](#bug-bugs-and-issues)
- [:page_facing_up: License](#page_facing_up-license)
- [:green_heart: Code of conduct](#green_heart-code-of-conduct)

# :star: Introduction

Various projects at Song do not have a full or even partial documentation in the repositories to onboard new team members or give an overview of how to run the application or how it works.
Reasons for this problem are not enough time or the missing knowledge of how a documentation contains to be of service.

The purpose of this "documentation skeleton" project is to provide a simple way to add a documentation to your project by providing a documentation skeleton including examples and an easy-to-follow structure.

## Goals

- Enable engineers to add a full documentation with the least amount of effort to save time and money.
- Lessen the mental workload for engineers, as they will know in every project that uses the unified documentation project where to find the information they are looking for.
- Onboard new members faster on the projects.
- Keep information out of silos. Keep information preserved after people leave the project.

## :file_folder: Documentation Structure

    .
    └── src/docs
        └── README.md
        └── ARCHITECTURE.md
        └── CODE_OF_CONDUCT.md
        └── CONTRIBUTE.md
        └── DEPLOYMENT.md
        └── GET_STARTED.md
        └── GLOSSARY.md
        └── PROJECT_BACKGROUND.md
        └── TESTING.md

## Requirements

1. This setup is working for all operating system, testing on Windows 8, Windows 8.1, Windows 10, Mac and Linux.
   This project is a Node.js package. You need Node Version 4 or higher and npm Version 2 or higher, check your installed version with node -v and npm -v.

2. To run our code you have to meet the following requirements:

- Node.js => v14.0.0 <br>
  (for more information check out the [Node.js Documentation](https://nodejs.org/en/docs/))

- If you use Yarn, then => v1.2.0
- If you use Npm, then => v8.0.0

## Installation

To install the package in your project follow these steps:

install the package:

```bash
npm install @deven-org/documentation-skeleton --save-dev
```

or

```bash
yarn add @deven-org/documentation-skeleton --dev
```

Add the following entries to your `package.json` scripts section:

```json
   "scripts": {
      "doc:install": "deven-documentation-skeleton install",
      "doc:check": "deven-documentation-skeleton check",
      "doc:update": "deven-documentation-skeleton update"
   }
```

## :rocket: How to use it

### 1. Install

Install the documentation using the command `install` command.

```bash
npm run doc:install
```

or

```bash
yarn doc:install
```

<details>
<summary>What to expect?</summary>
<br />

First of all a new folder will be created (`./docs`) containing all the skeleton chapters.
Then it will be generated a config (`./.deven-skeleton-install.config`) which will track the installed version.

If the `./docs` folder exists already, it will be renamed to `./_docs_backup_please_rename` and a new `docs` folder will be generated.
If both the `docs` folder and the `_docs_backup_please_rename` folder are existing, the script won't proceed until you don't delete one of them.

If the `./.deven-skeleton-install.config` is already existing, the script will just stop. It means that the documentation skeleton has been already succesfully installed and there's no need to proceed with a new installation.

</details>

### 2. Check

Once the documentation skeleton has been installed, you can use the `check` command to verify the status of the documentation.

```bash
npm run doc:check
```

or

```bash
yarn doc:check
```

<details>
<summary>What to expect?</summary>
<br />

The tool will show the `diff` between the skeleton chapters and the chapters located in the local documentation folder.
If other files have been added to the `docs` folder, they will be ignored.

The content of the chapters won't be analysed nor considered for this report.

</details>

### 3. Update

In case a previous version that used the `doc` folder instead of `docs`, the command `update` will try to rename the folder if no other `docs` folder already exists. Otherwise an error will be shown and the process will be aborted.  
Furthermore some of the files will be renamed: `CODEOFCONDUCT.md` to `CODE_OF_CONDUCT.md`, `GETSTARTED.md` to `GET_STARTED.md` and `PROJECTBACKGROUND.md` to `PROJECT_BACKGROUND.md`.

In case one or more chapters are missing in the local documentation folder, the command `update` will clone them into the `docs` folder.

```bash
npm run doc:update
```

or

```bash
yarn doc:update
```

<details>
<summary>What to expect?</summary>
<br />

If the documentation folder is missing, it will be created.
If the README file is missing, it will be created.
The tool will clone the missing chapters in the documentation folder.

If the local version is greater than the one of the installed packaged, the script won't run.

</details>

<br>

# :white_check_mark: How to test

[Read more](./docs/TESTING.md)

# :v: Contribute

[Read more](./docs/CONTRIBUTE.md)

# :bug: Bugs and Issues

If you would like to open an issue, you can gladly use [this page](https://git.sinnerschrader.com/deven/documentation-skeleton/-/issues).
But please, have a look at the [Contribute](./docs/CONTRIBUTE.md) page before filing a bug.

# :page_facing_up: License

[MIT LICENCE](./LICENSE.md)

# :green_heart: Code of conduct

You can find the [Code of Conduct here](./docs/CODE_OF_CONDUCT.md)
