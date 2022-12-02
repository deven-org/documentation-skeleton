# Welcome to our docs contributing guide <!-- omit in toc -->

Thank you for investing your time in contributing to our project! We sincerely appreciate it. :sparkles:.
Please, read our [Code of Conduct](./CODEOFCONDUCT.md) to keep our community approachable and respectable.

## Chapters

- [Chapters](#chapters)
- [New contributor guide](#new-contributor-guide)
- [Getting started](#getting-started)
  - [:file_folder: File Structure](#file_folder-file-structure)
- [Issues](#issues)
    - [Create a new issue](#create-a-new-issue)
  - [Solve an issue](#solve-an-issue)
    - [Prerequisites](#prerequisites)
    - [Commits](#commits)
    - [Branch](#branch)

## New contributor guide

To get an overview of the project, read the [README](../README.md). Here are some resources to help you get started with open source contributions:

- [How to install git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [How to handle repositories](https://docs.gitlab.com/ee/user/project/repository/)
- [Creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue)
- [Creating merge requests](https://docs.gitlab.com/ee/user/project/merge_requests/creating_merge_requests.html)

## Getting started

### :file_folder: File Structure

    .
    └── src
        └── __tests__     // Unit test (*.spec.ts)
        └── commands      // CLI's commands classes
        └── shared        // Global configuration and log messages
        └── doc           // the documentation skeleton
        └── config        // the configuration file blueprint
    └── dist              // build output
    └── bin               // cli entrypoint
    └── gitlab-ci.yml     // GitLab CI/CD pipeline
    └── CHANGELOG.md      // This file is automatically created by the release stage of the main pipeline. Please don't touch it.
    └── .releaserc        // semantic-release configuration file

## Issues

#### Create a new issue

If you spot a problem with the tool or the documentation, please [search if an issue already exists](https://git.sinnerschrader.com/deven/documentation-skeleton/-/issues/). If a related issue doesn't exist, you can open a new issue using the same page.

<details>
<summary>How to write a useful issue?</summary>
<br />

- It should be _reproducible_. It should contain all the istructions needed to reproduce the same outcome.

- It should be _specific_. It's important that it addresses one specific problem.

</details>

### Solve an issue

Scan through our [existing issues](https://git.sinnerschrader.com/deven/documentation-skeleton/-/issues/) to find one that interests you.
If you find an issue to work on, you are welcome to open a Merge Request with a fix.

#### Prerequisites

Please, before submitting any merge request, be sure that your branch is passing all the tests.

```bash
npm run test
```

or

```bash
yarn test
```

#### Commits

The commits must be compliant with with the [Conventional Commits specification](https://www.conventionalcommits.org/en/v1.0.0/).

#### Branch

For contributions we are using [Gitflow as branching strategy](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow#:~:text=Gitflow%20is%20a%20legacy%20Git,software%20development%20and%20DevOps%20practices.).

#
