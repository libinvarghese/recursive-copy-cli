import console from 'console';
import yargs from 'yargs/yargs';
import type { Arguments, Argv, MiddlewareFunctionEx } from 'yargs';
import type { RecursiveCopyCliModel } from '../cli-model';
import { renameParamsToFunction } from './rename-params-to-fn';
import { transformParamsToFunction } from './transform-to-fn';
import { filterCoerce } from './filter-coerce';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const packageJSON = require('../../package.json');

/* eslint-disable @typescript-eslint/method-signature-style */
declare module 'yargs' {
  // eslint-disable-next-line @typescript-eslint/ban-types
  interface Argv<T = {}> {
    middleware(
      callbacks: MiddlewareFunctionEx<T> | MiddlewareFunctionEx<T>[],
      applyBeforeValidation?: boolean
    ): Argv<T>;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/prefer-readonly-parameter-types
  type MiddlewareFunctionEx<T = {}> = (args: Arguments<T>, yargs: Argv<T>) => void;
}
/* eslint-enable @typescript-eslint/method-signature-style */

const failHandler = (msg: string, err: Readonly<Error> | undefined, yargsObj: Readonly<Argv>): void => {
  yargsObj.showHelp();

  // eslint-disable-next-line no-console
  console.error();
  // eslint-disable-next-line no-console
  console.error(msg);

  // if (err) throw err as Error; // preserve stack

  // Explicitly exit, else yargs will pass
  yargsObj.exit(1, err ?? new Error(msg));
};

// Handle exceptions thrown by middleware, since they are not handled by yargs
function gracefulMiddleware(middleware: MiddlewareFunctionEx): MiddlewareFunctionEx {
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  return (argv: Arguments, yargsObj: Argv): void => {
    try {
      middleware(argv, yargsObj);
    } catch (error: unknown) {
      let msg = '';
      if (error instanceof Error) {
        msg = error.message;
      }
      failHandler(msg, error as Error, yargsObj);
    }
  };
}

export function getYargsInstance(): Argv {
  const yargsInstance = yargs();

  yargsInstance.parserConfiguration({
    'parse-numbers': false,
    'strip-aliased': true,
    'strip-dashed': true,
  });

  yargsInstance
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

  yargsInstance
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
      coerce: (value?: number) => {
        if (value !== undefined && isNaN(value)) {
          throw new Error('Error: Invalid concurrency option');
        }

        return value;
      },
    })
    .option('debug', {
      alias: 'v',
      description: 'Whether to log debug information [Default: false]',
      type: 'boolean',
    });

  yargsInstance
    .option('renameModule', {
      alias: 'r',
      description: 'renames source paths using the module',
      type: 'array',
      conflicts: 'renamePattern',
      requiresArg: true,
    })
    .option('renamePattern', {
      alias: 'p',
      description: 'renames patterns in source paths. eg: :: -',
      type: 'array',
      nargs: 2,
      requiresArg: true,
    });

  yargsInstance.middleware([
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    gracefulMiddleware((argv): void => {
      // remove all undefined values
      Object.keys(argv).forEach(key => {
        if (argv[key] === undefined) {
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete argv[key];
        }
      });
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

  yargsInstance.wrap(yargsInstance.terminalWidth()).showHelpOnFail(true).strict().strictOptions();

  return yargsInstance;
}
