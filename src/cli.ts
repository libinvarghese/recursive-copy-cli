#!/usr/bin/env node
// eslint-disable-next-line import/default
import yargs from './yargs/setup';
import { RecursiveCopyCliModel } from './cli-model';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const copy = require('recursive-copy');

const argv: RecursiveCopyCliModel = (yargs.argv as unknown) as RecursiveCopyCliModel;

copy(argv.src, argv.dest, {
  // overwrite: argv.overwrite,
  // expand: argv.expand,
  // dot: argv.dot,
  // junk: argv.junk,
  // filter: argv.filter,
  rename: argv.rename
  // transform,
  // results: argv.results,
  // concurrency: argv.concurrency,
  // debug: argv.debug
})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .on(copy.events.COPY_FILE_COMPLETE, (copyOperation: any) =>
    // eslint-disable-next-line no-console
    console.info(`${copyOperation.src} -> ${copyOperation.dest}`)
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .on(copy.events.ERROR, (error: any, copyOperation: any) =>
    // eslint-disable-next-line no-console
    console.error(`Unable to copy ${copyOperation.src} -> ${copyOperation.src}. ERR: ${error}`)
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-console
  .then((results: any) => console.info(results.length + ' file(s) copied'))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,no-console
  .catch((error: any) => console.error('Copy failed! ERR: ' + error));
