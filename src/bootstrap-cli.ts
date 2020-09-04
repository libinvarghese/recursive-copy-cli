// eslint-disable-next-line import/default
import copy, { CopyOperation, CopyErrorInfo } from 'recursive-copy';
import yargs from './yargs/setup';
import { RecursiveCopyCliModel } from './cli.model';

export async function bootstrapCli(cliArgs?: string[]): Promise<void> {
  cliArgs = cliArgs || process.argv.slice(2);
  // const argv: RecursiveCopyCliModel = (yargs.argv as unknown) as RecursiveCopyCliModel;
  const argv: RecursiveCopyCliModel = (yargs.parse(cliArgs) as unknown) as RecursiveCopyCliModel;
  const cliOptionsKeysToCopy = ['overwrite', 'expand', 'dot', 'junk', 'filter', 'rename', 'transform', 'debug'];
  // Copy the options from argv to pass to copy
  const options: {
    [key: string]: unknown;
  } = cliOptionsKeysToCopy.reduce(
    (prev, key) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const value = (argv as any)[key];
      if (value != undefined) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        prev[key] = value;
      }
      return prev;
    },
    {} as {
      [key: string]: unknown;
    }
  );

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    .on(copy.events.ERROR, (error: Error, copyOperation: CopyErrorInfo) => {
      // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
      console.error(`Unable to copy ${copyOperation.src} -> ${copyOperation.dest}. ERR: ${error}`);
      process.exitCode = 1;
    })
    // eslint-disable-next-line no-console
    .then((results: CopyOperation[]) => console.log(`${results.length} item(s) copied`))
    // eslint-disable-next-line no-console, @typescript-eslint/restrict-template-expressions
    .catch((error: unknown) => console.error(`Copy failed! ERR: ${error}`));
}
