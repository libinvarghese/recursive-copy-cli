# recursive-copy-cli

[![License: ISC](https://img.shields.io/npm/l/recursive-copy-cli)](https://opensource.org/licenses/ISC)
![Dependabot](https://badgen.net/dependabot/libinvarghese/recursive-copy-cli?icon=dependabot) <!-- ![Dependabot](https://img.shields.io/badge/Dependabot-active-green?logo=dependabot) -->
![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)
[![npm](https://img.shields.io/npm/v/recursive-copy-cli)](https://www.npmjs.com/package/recursive-copy-cli)
[![downloads](https://img.shields.io/npm/dt/recursive-copy-cli)](https://www.npmjs.com/package/recursive-copy-cli)
![node-lts](https://img.shields.io/node/v-lts/recursive-copy-cli)
<!-- Alternative for npm version
[![License: ISC](https://img.shields.io/badge/License-ISC-blue?logo=open-source-initiative)](https://opensource.org/licenses/ISC)
![GitHub package.json version](https://img.shields.io/github/package-json/v/libinvarghese/recursive-copy-cli)
![GitHub release (latest by date)](https://img.shields.io/github/v/release/libinvarghese/recursive-copy-cli)
-->

**master**: ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/libinvarghese/recursive-copy-cli/build?logo=github)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/libinvarghese/recursive-copy-cli/test?label=test&logo=github)
![Codecov](https://img.shields.io/codecov/c/github/libinvarghese/recursive-copy-cli?logo=codecov)

**develop**: ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/libinvarghese/recursive-copy-cli/build/develop?logo=github)
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/libinvarghese/recursive-copy-cli/test/develop?label=test&logo=github)
![Codecov](https://img.shields.io/codecov/c/github/libinvarghese/recursive-copy-cli/develop?logo=codecov)

> CLI for [recursive-copy](https://github.com/timkendrick/recursive-copy)

## Installing the command line tool
Installation is as simple as running the following command

    npm install -g recursive-copy-cli

## Using the command line tool
    recursive-copy <src> <dest>

    Positionals:
      src   Source file/folder path                                                                                  [string]
      dest  Destination file/folder path                                                                             [string]

    Options:
      --help                  Show help                                                                             [boolean]
      --version               Show version number                                                                   [boolean]
      --overwrite, -w         Whether to overwrite destination files [Default: false]                               [boolean]
      --expand, -e            Whether to expand symbolic links [Default: false]                                     [boolean]
      --dot, -d               Whether to copy files beginning with a .(dot) [Default: false]                        [boolean]
      --junk, -j              Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db) [Default: false]            [boolean]
      --filter, -f            Filter regular expression / glob that determines which files to copy (uses maximatch)   [array]
      --transform-module, -t  Function that returns a transform stream used to modify file contents                   [array]
      --concurrency, -c       Maximum number of simultaneous copy operations [Default: 255]                          [number]
      --debug, -v             Whether to log debug information [Default: false]                                     [boolean]
      --rename-module, -r     renames source paths using the module                                                   [array]
      --rename-pattern, -p    renames patterns in source paths. eg: :: -                                              [array]

    Examples:
      recursive-copy srcPath destPath -r pascalcase                       Renames files using the pascalcase module
      recursive-copy srcPath destPath -p '::' '-'                         Renames someFile::name.ext to someFile-name.ext
      recursive-copy srcPath destPath -p '/(.*)-(.*)\.(.*)/g' '$2-$1.$3'  Renames author-title.ext to title-author.ext
      recursive-copy srcPath destPath -f '*.json' '/\*.js$/'              Only Copies json & js files
      recursive-copy srcPath destPath -f "*.js" -t some-transform-module  modify the contents of js files

    Use --no-<option> to toggle boolean options. eg: --no-overwrite or --no-w

    When specifying a module, you could specify a global module, local module or provide the path to file.
    eg: ./someFolder/pascalcase/index.js

    For more help refer https://github.com/libinvarghese/recursive-copy-cli

## Example

    $ recursive-copy source dest
    source -> dest
    source/a -> dest/a
    source/b -> dest/b
    source/c -> dest/c
    4 item(s) copied

## FAQ
* **What is a rename or transform module?**

  **rename-module** a function that renames the file name.

  **transform-module** a function that transforms the content of the file

  Refer [recursive-copy](https://github.com/timkendrick/recursive-copy#advanced-options) for more info regarding rename/transform module.
* **Can I provide multiple modules?**

  Yes, you can pipe the result of one module into another.

      recursive-copy srcPath destPath -r pascalcase ./path/to/a/rename-module.js
      recursive-copy srcPath destPath -t ./path/to/add-header-module.js ./path/to/change-eol-module.js
