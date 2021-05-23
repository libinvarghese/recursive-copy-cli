import path from 'path';
import { isError } from './util';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
const requireg = require('requireg');

// eslint-disable-next-line complexity
export function requireTryAll(module: string): unknown | undefined {
  let fn: unknown | undefined = undefined;
  try {
    // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
    fn = require(module);
  } catch (reqError: unknown) {
    try {
      // Search global file
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (isError(reqError) && reqError.code == 'MODULE_NOT_FOUND') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        fn = requireg(module);
      }
    } catch (error: unknown) {
      // Search by path
      // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
      fn = require(path.resolve(module));
    }
  }
  return fn;
}
