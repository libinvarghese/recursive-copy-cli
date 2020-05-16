#!/usr/bin/env node
// eslint-disable-next-line import/default
import yargs from './yargs/setup';
import { RecursiveCopyCliModel } from './cli.model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const copy = require('recursive-copy');

const argv: RecursiveCopyCliModel = (yargs.argv as unknown) as RecursiveCopyCliModel;

const cliOptionsKeysToCopy = ['overwrite', 'expand', 'dot', 'junk', 'filter', 'rename', 'transform', 'debug'];

// Copy the options from argv to pass to copy
const options: { [key: string]: unknown } = cliOptionsKeysToCopy.reduce((prev, key) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const _value = (argv as any)[key];
  if (_value != undefined) {
    prev[key] = _value;
  }

  return prev;
}, {} as { [key: string]: unknown });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function onCopyItemEvent(copyOperation: any): void {
  // eslint-disable-next-line no-console
  console.info(`${copyOperation.src} -> ${copyOperation.dest}`);
}

copy(argv.src, argv.dest, options)
  .on(copy.events.COPY_FILE_COMPLETE, onCopyItemEvent)
  .on(copy.events.CREATE_SYMLINK_COMPLETE, onCopyItemEvent)
  .on(copy.events.CREATE_DIRECTORY_COMPLETE, onCopyItemEvent)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .on(copy.events.ERROR, (error: unknown, copyOperation: any) =>
    // eslint-disable-next-line no-console
    console.error(`Unable to copy ${copyOperation.src} -> ${copyOperation.dest}. ERR: ${error}`)
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, no-console
  .then((results: any) => console.info(results.length + ' items(s) copied'))
  // eslint-disable-next-line no-console
  .catch((error: unknown) => console.error('Copy failed! ERR: ' + error));
