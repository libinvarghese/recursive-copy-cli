import copy from 'recursive-copy';
import { getYargsInstance } from './yargs/setup';
import type { CopyOperation, CopyErrorInfo } from 'recursive-copy';
import type { RecursiveCopyCliModel } from './cli.model';

export async function bootstrapCli(cliArgs?: string[]): Promise<void> {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  cliArgs = cliArgs ?? process.argv.slice(2);
  // const argv: RecursiveCopyCliModel = (yargs.argv as unknown) as RecursiveCopyCliModel;
  const argv: RecursiveCopyCliModel = getYargsInstance().parseSync(cliArgs) as unknown as RecursiveCopyCliModel;
  const cliOptionsKeysToCopy = ['overwrite', 'expand', 'dot', 'junk', 'filter', 'rename', 'transform', 'debug'];
  // Copy the options from argv to pass to copy
  const options = cliOptionsKeysToCopy.reduce<Record<string, unknown>>(
    // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
    (prev, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const value = (argv as any)[key];
      if (value != undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        prev[key] = value;
      }
      return prev;
    },
    {}
  );

  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
  function onCopyItemEvent(copyOperation: CopyOperation): void {
    // eslint-disable-next-line no-console
    console.log(`${copyOperation.src} -> ${copyOperation.dest}`);
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
  await copy(argv.src, argv.dest, options)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .on(copy.events.COPY_FILE_COMPLETE, onCopyItemEvent)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .on(copy.events.CREATE_SYMLINK_COMPLETE, onCopyItemEvent)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .on(copy.events.CREATE_DIRECTORY_COMPLETE, onCopyItemEvent)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/prefer-readonly-parameter-types
    .on(copy.events.ERROR, (error: Readonly<Error>, copyOperation: CopyErrorInfo) => {
      // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
      console.error(`Unable to copy ${copyOperation.src} -> ${copyOperation.dest}. ERR: ${error}`);
      process.exitCode = 1;
    })
    // eslint-disable-next-line promise/always-return, @typescript-eslint/prefer-readonly-parameter-types
    .then((results: readonly CopyOperation[]) => {
      // eslint-disable-next-line no-console
      console.log(`${results.length} item(s) copied`);
    })
    .catch((error: unknown) => {
      // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
      console.error(`Copy failed! ERR: ${error}`);
    });
}
