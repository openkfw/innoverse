# Contributing to InnoVerse

Thanks for taking the time to contribute!

The following is a set of guidelines for contributing. These are mostly
guidelines, not rules. Use your best judgment, and feel free to propose changes
to this document in a pull request.

## Table of Contents

- [Contributing to InnoVerse](#contributing-to-innoverse)
  - [Table of Contents](#table-of-contents)
  - [Code of Conduct](#code-of-conduct)
  - [How to get started with InnoVerse](#how-to-get-started-with-innoverse)
  - [How to contribute](#how-to-contribute)
    - [Set up git hooks](#set-up-git-hooks)
    - [Start working on open issues](#start-working-on-open-issues)
    - [Create an issue or suggest a new feature](#create-an-issue-or-suggest-a-new-feature)
    - [Open a Pull Request](#open-a-pull-request)
    - [Creating a release](#creating-a-release)
  - [How to ask for support](#how-to-ask-for-support)
  - [Styleguides](#styleguides)
    - [Git Commits](#git-commits)
    - [Git Branches](#git-branches)
    - [Git Workflow](#git-workflow)
  - [What it means](#what-it-means)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct]. By participating, you are expected to uphold this code. Please report unacceptable behavior to NAMEXYZ , who is the current project maintainer.

## How to get started with InnoVerse

If this is your first time starting InnoVerse, you should follow the [StartUp Guide] for setting up the project.

## How to contribute

### Set up git hooks

At first, please run

`npm run prepare`

in the repository's root folder to set up our git hooks, which we use to enforce the [conventional commit message format](https://www.conventionalcommits.org/).

### Start working on open issues

If you want to contribute, you can start by picking an issue from the [issue board]. You can assign it to yourself and start working on it.

### Create an issue or suggest a new feature

Noticed a bug or have some clear suggestions? Please feel free to open a new [github issue].
If you want to suggest a new feature simply open a new discussion in the [ideas channel]

### Open a Pull Request

When working on a feature, you can open a PR in as soon as you push the first changes. Please make sure you follow these guidelines regarding PRs:

- For external contributors: Make sure to open a new [fork] to our repository and then open a PR from that fork to this repository

- Make sure that the PR description clearly describes what you are working on
- If aplicable, mention what issue will be closed with this pull request, by typing `Closes #issueNumber`
- Describe how you are planning on implementing the soultion, maybe by creating a TODO list
- The PR should be in draft mode if you're still making some changes. If it is ready to be reviewed then mark it as "Ready for review"

### Creating a release

In order to create a release, follow the [release guide]

## How to ask for support

If you need to ask for support feel free to reach out to us on our [QA-Channel].

## Styleguides

### Git Commits

When writing commits you should consider the following guidelines:

- Write commit messages according to the [conventional commit specification](https://www.conventionalcommits.org/).
- Follow these [git commit guidelines]
- When you're only changing the documentation you can include `[ci skip]` in the commit title

### Git Branches

When creating a new branch, you should consider the following guidelines regarding branch names:

- Lead with the number of the issue you are working on
- Add a short description of what the task is about
- Use hyphens as separators

Example:

- 213-your-issue

### Git Workflow

To get an idea about the workflow used in our project you should read this how to / git. So when working on a feature branch make sure to:

- Checkout the main branch and pull the recent changes

```sh
$ git checkout main
```

```sh
$ git pull
```

- Create a new feature branch respecting the guidelines mentioned above

```sh
$ git checkout -b 213-your-issue
```

- Try to keep the commits separate and respect the guidelines mentioned above. Don't squash the commits into a single one especially if you changed a lot of files
- Push to the remote repository and open a pull request respecting the guidelines mentioned above

```sh
$ git push origin
```

- Make sure the pipelines are passing
- Wait for a review. If you need a specific team member to review the PR you can request a review from them and assign them to the PR
- When your feature is ready make sure you have the latest changes by running $ git pull --rebase origin main on your feature branch and push the changes
- Merge the pull request into main

## What it means

Thank you for your contributions and dedication to improving our project. Your efforts make a meaningful impact, and we look forward to collaborating with you!

[code of conduct]: ./CODE_OF_CONDUCT.md
[StartUp Guide]: ./docs/developer/START_UP_GUIDE.md
[release guide]: ./docs/developer/RELEASE_GUIDE.md
[guidelines]: https://keepachangelog.com/en/1.0.0/
[git commit guidelines]: https://cbea.ms/git-commit/
[github issue]: https://github.com/openkfw/innoverse/issues
[discussions]: https://github.com/openkfw/innoverse/discussions
[QA-Channel]: https://github.com/openkfw/innoverse/discussions/categories/q-a
[ideas channel]: https://github.com/openkfw/innoverse/discussions/categories/ideas
[fork]: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo
[issue board]: https://github.com/openkfw/innoverse/issues
