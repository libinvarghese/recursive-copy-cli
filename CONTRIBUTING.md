# Contributing
We love your input! We want to make contributing to this project as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features

## We Develop with Github
We use github to host code, to track issues and feature requests, as well as accept pull requests.

## We Use [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow), So All Code Changes Happen Through Pull Requests
Pull requests are the best way to propose changes to the codebase (we use [Git Flow](hhttps://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)). All pull requests get merged into the `develop` branch (active development branch), which when release gets merged to the `master` (production branch). We actively welcome your pull requests:

1. Fork the repo and create your branch from `develop`.
1. If you've added code that should be tested, add tests.
1. If you've changed APIs, update the documentation.
1. Ensure the test suite passes.
1. Make sure your code lints.
1. Commit your changes. We follow an adapted version of [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/@commitlint/config-conventional)
   1. `header-max-length: 72`
   1. `scope-enum: ['yargs', 'cli', 'deps', 'deps-dev']`
1. Issue that pull request!

```shellscript
git checkout develop
git checkout -b feature/some_branch # OR git flow feature start some_branch
npm install # Install dependencies.
#
#.... modify the code ....
#
npm run test  # Ensure the test suite passes.
npm run lint  # Make sure your code lints.
npm run commit  # Follow @commitlint/config-conventional. Refer [.commitlintrc.js](https://github.com/libinvarghese/recursive-copy-cli/blob/master/.commitlintrc.js)
git push feature/some_branch # OR git flow feature publish
```

## Any contributions you make will be under the ISC Software License
In short, when you submit code changes, your submissions are understood to be under the same [ISC License](http://choosealicense.com/licenses/isc/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using Github's [issues](https://github.com/libinvarghese/recursive-copy-cli/issues)
We use GitHub issues to track public bugs. Report a bug by [opening a new issue](); it's that easy!

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can.
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

People *love* thorough bug reports.

## Use a Consistent Coding Style
This document was adapted from the open-source contribution guidelines for [Facebook's Draft](https://github.com/facebook/draft-js/blob/a9316a723f9e918afde44dea68b5f9f39b7d9b00/CONTRIBUTING.md)

* 2 spaces for indentation rather than tabs
* You can try running `npm run lint` for style unification

