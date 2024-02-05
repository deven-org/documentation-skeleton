# Testing

This chapter provides the user with all needed information around testing within this project.

## Content

- [Testing](#testing)
  - [Content](#content)
  - [Tooling](#tooling)
  - [Jest](#jest)
  - [mock-fs](#mock-fs)
  - [jest-mock-process](#jest-mock-process)
  - [How to write tests](#how-to-write-tests)
  - [How to run tests](#how-to-run-tests)

## Tooling

## Jest

As _testing framework_ we are currently using [Jest](https://jestjs.io/).

## mock-fs

Since the CLI is mainly reading and writing files, the tests are using the _mock-fs_ module to allow Node's built-in fs module to be backed temporarily by an in-memory, mock file system.
This lets you run tests against a set of mock files and directories instead of lugging around a bunch of test fixtures.

[Read more here](https://github.com/tschaub/mock-fs).

## jest-mock-process

The CLI will be most probably used also in CI/CD pipelines. Therefore the _process exit-codes_ are very important.
The _jest-mock-process_ module mocks the Node's process properties in Jest making them easily testable.

[Read more here](https://github.com/EpicEric/jest-mock-process#readme).

## How to write tests

We don't use any specific testing strategy.

We highly recommend to use the following beforeEach/afterEach script to mock the fs and the process module and to instantiate the command:

```ts
afterEach(() => {
  mockFs.restore();
  mockExit.mockRestore();
  mockStdout.mockRestore();
  mockStderr.mockRestore();
  mockLog.mockRestore();
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
  install = new Install({
    basePath: "fake_test_folder",
    ...configuration,
    moduleBasePath: path.join(".", "src"),
    packageVersion: "1.0.0",
  });
});
```

## How to run tests

Local Setup:

```sh
$ git clone https://git.sinnerschrader.com/deven/documentation-skeleton.git
$ cd documentation-skeleton
$ npm install
```

The project test suite is run with

```sh
$ npm run test
```
