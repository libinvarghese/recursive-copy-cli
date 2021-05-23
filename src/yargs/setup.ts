import yargs from 'yargs';
import { renameParamsToFunction } from './rename-params-to-fn';
import { transformParamsToFunction } from './transform-to-fn';
import { filterCoerce } from './filter-coerce';
import type { MiddlewareFunctionEx, Arguments, Argv } from 'yargs';
import type { RecursiveCopyCliModel } from '../cli.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const packageJSON = require('../../package.json');

/* eslint-disable @typescript-eslint/method-signature-style */
declare module 'yargs' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Argv<T = {}> {
    /**
     * Any command-line argument given that is not demanded, or does not have a corresponding description, will be reported as an error.
     *
     * Unrecognized commands will also be reported as errors.
     */
    strictCommands(enabled?: boolean): Argv<T>;

    middleware(
      callbacks: MiddlewareFunctionEx<T> | MiddlewareFunctionEx<T>[],
      applyBeforeValidation?: boolean
    ): Argv<T>;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/prefer-readonly-parameter-types
  type MiddlewareFunctionEx<T = {}> = (args: Arguments<T>, yargs: Argv<T>) => void;
}
/* eslint-enable @typescript-eslint/method-signature-style */

yargs.parserConfiguration({
  'parse-numbers': false,
  'strip-aliased': true,
  'strip-dashed': true,
});

yargs
  .usage(
    '$0 <src> <dest>',
    '',
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    yargsObj =>
      yargsObj
        .positional('src', {
          description: 'Source file/folder path',
          type: 'string',
        })
        .positional('dest', {
          description: 'Destination file/folder path',
          type: 'string',
        })
        .demandCommand(0, 0, '', 'Too many arguments: got $0 unknown arguments')
        .example(`$0 srcPath destPath -r pascalcase`, 'Renames files using the pascalcase module')
        .example(`$0 srcPath destPath -p '::' '-'`, 'Renames someFile::name.ext to someFile-name.ext')
        .example(
          `$0 srcPath destPath -p '/(.*)-(.*)\\.(.*)/g' '$2-$1.$3'`,
          'Renames author::title.ext to title-author.ext'
        )
        .example(`$0 srcPath destPath -f '*.json' '/\\*.js$/'`, 'Only Copies json & js files')
        .example(`$0 srcPath destPath -f "*.js" -t some-transform-module`, 'modify the contents of js files')
        .epilogue(`Use --no-<option> to toggle boolean options. eg: --no-overwrite or --no-w

When specifying a module, you could specify a global module, local module or provide the path to file.
eg: ./someFolder/pascalcase/index.js in case of file or node_modules/pascalcase in case of local module

For more help refer ${packageJSON.homepage}`) // eslint-disable-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
  )
  .strictCommands();

yargs
  .option('overwrite', {
    alias: 'w',
    description: 'Whether to overwrite destination files [Default: false]',
    type: 'boolean',
  })
  .option('expand', {
    alias: 'e',
    description: 'Whether to expand symbolic links [Default: false]',
    type: 'boolean',
  })
  .option('dot', {
    alias: 'd',
    description: 'Whether to copy files beginning with a .(dot) [Default: false]',
    type: 'boolean',
  })
  .option('junk', {
    alias: 'j',
    description: 'Whether to copy OS junk files (e.g. .DS_Store, Thumbs.db) [Default: false]',
    type: 'boolean',
  })
  .option('filter', {
    alias: 'f',
    description: 'Filter regular expression / glob that determines which files to copy (uses maximatch)',
    type: 'array',
    requiresArg: true,
    coerce: filterCoerce,
  })
  .option('transform-module', {
    alias: 't',
    description: 'Function that returns a transform stream used to modify file contents',
    type: 'array',
    requiresArg: true,
  })
  .option('concurrency', {
    alias: 'c',
    description: 'Maximum number of simultaneous copy operations [Default: 255]',
    type: 'number',
    requiresArg: true,
  })
  .option('debug', {
    alias: 'v',
    description: 'Whether to log debug information [Default: false]',
    type: 'boolean',
  });

yargs
  .option('rename-module', {
    alias: 'r',
    description: 'renames source paths using the module',
    type: 'array',
    conflicts: ['rename-pattern'],
    requiresArg: true,
  })
  .option('rename-pattern', {
    alias: 'p',
    description: 'renames patterns in source paths. eg: :: -',
    type: 'array',
    nargs: 2,
    requiresArg: true,
  })
  .strict();

// Handle exceptions thrown by middleware
function gracefulMiddleware(middleware: MiddlewareFunctionEx): MiddlewareFunctionEx {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  return (argv: Arguments, yargsObj: Argv): void => {
    try {
      middleware(argv, yargsObj);
    } catch (error: unknown) {
      if (error instanceof Error) {
        // TODO: definition for getUsageInstance
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
        (yargsObj as any).getUsageInstance().fail(error.message);
      }
    }
  };
}

yargs.middleware([
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  gracefulMiddleware((argv): void => {
    // Concurrency can be NaN if the user did not enter a number
    if (argv.concurrency !== undefined && isNaN(argv.concurrency as number)) {
      throw new Error('Error: Invalid concurrency option');
    }
  }),
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  gracefulMiddleware((argv): void => {
    renameParamsToFunction(argv as unknown as RecursiveCopyCliModel);
  }),
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  gracefulMiddleware((argv): void => {
    transformParamsToFunction(argv as unknown as RecursiveCopyCliModel);
  }),
]);

yargs.wrap(yargs.terminalWidth());

export = yargs;
