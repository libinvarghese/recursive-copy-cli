#!/usr/bin/env node

import yargs from 'yargs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../package.json');

declare module 'yargs' {
  interface Argv<T = {}> {
    /**
     * Any command-line argument given that is not demanded, or does not have a corresponding description, will be reported as an error.
     *
     * Unrecognized commands will also be reported as errors.
     */
    strictCommands(): Argv<T>;
    strictCommands(enabled: boolean): Argv<T>;
  }
}

yargs
  .usage('$0 <src> <dest>', '', yargs =>
    yargs
      .positional('src', {
        description: 'Source file/folder path',
        type: 'string'
      })
      .positional('dest', {
        description: 'Destination file/folder path',
        type: 'string'
      })
      .demandCommand(0, 0, '', 'Too many arguments: got $0 unknown arguments')
      .example(`$0 srcPath destPath -m pascalcase`, 'Renames files using the pascalcase module')
      .example(`$0 srcPath destPath -p '::' -s '-'`, 'Renames someFile::name.ext to someFile-name.ext')
      .example(`$0 srcPath destPath -p '/(\\w*)::(\\w*)/g' -s '$2-$1'`, 'Renames author::title.ext to title-author.ext')
      .example(`$0 srcPath destPath -f '*.json' '*.[js|ts]'`, 'Only Copies json, js, & ts files')
      .example(`$0 srcPath destPath -f "*.js" -t babelify uglifyify`, 'Minify JS files')
      .epilogue(`For more help refer ${packageJSON.homepage}`)
  )
  .strictCommands();

yargs
  .option('overwrite', {
    alias: 'w',
    description: 'Whether to overwrite destination files',
    type: 'boolean',
    default: false
  })
  .option('expand', {
    alias: 'e',
    description: 'Whether to expand symbolic links',
    type: 'boolean',
    default: false
  })
  .option('dot', {
    alias: 'd',
    description: 'Whether to copy files beginning with a .',
    type: 'boolean',
    default: false
  })
  .option('junk', {
    alias: 'j',
    description: 'Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db)',
    type: 'boolean',
    default: false
  })
  .option('filter', {
    alias: 'f',
    description: 'Filter regular expression / glob that determines which files to copy (uses maximatch)',
    type: 'array',
    requiresArg: true
  })
  .option('rename-module', {
    alias: 'r',
    description: 'renames source paths using the module',
    type: 'string',
    requiresArg: true
  })
  .option('rename-pattern', {
    alias: 'p',
    description: 'renames patterns in source paths. Patterns can be string or regex expression',
    type: 'string',
    implies: 'rename-substitute',
    conflicts: 'rename-module',
    requiresArg: true
  })
  .option('rename-substitute', {
    alias: 's',
    description:
      'Substitutes patterns defined in --rename-pattern with the substitutes. Similar to String.prototype.replace substitute string',
    type: 'string',
    implies: 'rename-pattern',
    conflicts: 'rename-module',
    requiresArg: true
  })
  .option('transform', {
    alias: 't',
    description: 'Function that returns a transform stream used to modify file contents',
    type: 'array',
    requiresArg: true
  })
  .option('results', {
    alias: 'o',
    description: 'Whether to return an array of copy results',
    type: 'boolean',
    default: true
  })
  .option('concurrency', {
    alias: 'c',
    description: 'Maximum number of simultaneous copy operations',
    type: 'number',
    default: 255
  })
  .option('debug', {
    alias: 'v',
    description: 'Whether to log debug information',
    type: 'boolean',
    default: false
  })
  .strict();

yargs.wrap(yargs.terminalWidth());

const argv = yargs.argv;

// src	string	Yes	N/A	Source file/folder path
// dest	string	Yes	N/A	Destination file/folder path
// options.overwrite	boolean	No	false	Whether to overwrite destination files
// options.expand	boolean	No	false	Whether to expand symbolic links
// options.dot	boolean	No	false	Whether to copy files beginning with a .
// options.junk	boolean	No	false	Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db)
// options.filter	function, RegExp, string, array	No	null	Filter function / regular expression / glob that determines which files to copy (uses maximatch)
// options.rename	function	No	null	Function that maps source paths to destination paths
// options.transform	function	No	null	Function that returns a transform stream used to modify file contents
// options.results	boolean	No	true	Whether to return an array of copy results
// options.concurrency	number	No	255	Maximum number of simultaneous copy operations
// options.debug	boolean	No	false	Whether to log debug information

// eslint-disable-next-line no-console
console.log(JSON.stringify(argv));
