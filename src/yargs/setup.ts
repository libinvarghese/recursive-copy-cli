import yargs, { MiddlewareFunctionEx, Arguments, Argv } from 'yargs';
import { renameParamsToFunction } from './rename-params-to-fn';
import { RecursiveCopyCliModel } from '../cli-model';
import { transformParamsToFunction } from './transform-to-fn';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../../package.json');

declare module 'yargs' {
  interface Argv<T = {}> {
    /**
     * Any command-line argument given that is not demanded, or does not have a corresponding description, will be reported as an error.
     *
     * Unrecognized commands will also be reported as errors.
     */
    strictCommands(): Argv<T>;
    strictCommands(enabled: boolean): Argv<T>;

    middleware(
      callbacks: MiddlewareFunctionEx<T> | ReadonlyArray<MiddlewareFunctionEx<T>>,
      applyBeforeValidation?: boolean
    ): Argv<T>;
  }

  type MiddlewareFunctionEx<T = {}> = (args: Arguments<T>, yargs: Argv<T>) => void;
}

yargs.parserConfiguration({
  'parse-numbers': false,
  'strip-aliased': true,
  'strip-dashed': true
});

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
      .example(`$0 srcPath destPath -x '/(\\w*)::(\\w*)/g' -s '$2-$1'`, 'Renames author::title.ext to title-author.ext')
      .example(`$0 srcPath destPath -f '*.json' '*.[js|ts]'`, 'Only Copies json, js, & ts files')
      .example(`$0 srcPath destPath -f "*.js" -t babelify uglifyify`, 'Minify JS files')
      .epilogue(`Use --no-<option> to toggle boolean options. eg: --no-results or --no-o

When specifying a module, you could specify a global module, local module or provide the path to file.
eg: ./someFolder/pascalcase/index.js

For more help refer ${packageJSON.homepage}`)
  )
  .strictCommands();

yargs
  .option('overwrite', {
    alias: 'w',
    description: 'Whether to overwrite destination files [Default: false]',
    type: 'boolean'
  })
  .option('expand', {
    alias: 'e',
    description: 'Whether to expand symbolic links [Default: false]',
    type: 'boolean'
  })
  .option('dot', {
    alias: 'd',
    description: 'Whether to copy files beginning with a .(dot) [Default: false]',
    type: 'boolean'
  })
  .option('junk', {
    alias: 'j',
    description: 'Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db) [Default: false]',
    type: 'boolean'
  })
  .option('filter-glob', {
    alias: 'g',
    description: 'Filter regular expression / glob that determines which files to copy (uses maximatch)',
    type: 'array',
    requiresArg: true
  })
  .option('filter-module', {
    alias: 'f',
    description: 'Filter modules that determines which files to copy (uses maximatch)',
    type: 'array',
    requiresArg: true
  })
  .option('transform-module', {
    alias: 't',
    description: 'Function that returns a transform stream used to modify file contents',
    type: 'array',
    requiresArg: true
  })
  .option('results', {
    alias: 'o',
    description: 'Whether to return an array of copy results [Default: true]',
    type: 'boolean'
  })
  .option('concurrency', {
    alias: 'c',
    description: 'Maximum number of simultaneous copy operations [Default: 255]',
    type: 'number',
    requiresArg: true
  })
  .option('debug', {
    alias: 'v',
    description: 'Whether to log debug information [Default: false]',
    type: 'boolean'
  });

yargs
  .option('rename-module', {
    alias: 'r',
    description: 'renames source paths using the module',
    type: 'array',
    conflicts: ['rename-pattern'],
    requiresArg: true
  })
  .option('rename-pattern', {
    alias: 'p',
    description: 'renames patterns in source paths. eg: :: -',
    type: 'array',
    nargs: 2,
    requiresArg: true
  })
  .strict();

// Handle exceptions thrown by middleware
function gracefulMiddleware(middleware: MiddlewareFunctionEx): MiddlewareFunctionEx {
  return (argv: Arguments, yargs: Argv): void => {
    try {
      middleware(argv, yargs);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (yargs as any).getUsageInstance().fail(error.message);
    }
  };
}

yargs.middleware([
  gracefulMiddleware((argv): void => {
    // Concurrency can be NaN if the user did not enter a number
    if (argv.concurrency !== undefined && isNaN(argv.concurrency as number)) {
      throw new Error('Error: Invalid concurrency option');
    }
  }),
  gracefulMiddleware((argv): void => {
    renameParamsToFunction((argv as unknown) as RecursiveCopyCliModel);
  }),
  gracefulMiddleware((argv): void => {
    transformParamsToFunction((argv as unknown) as RecursiveCopyCliModel);
  })
]);

yargs.wrap(yargs.terminalWidth());

export = yargs;
