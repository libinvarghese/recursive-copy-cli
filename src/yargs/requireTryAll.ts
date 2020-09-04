import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-assignment
const requireg = require('requireg');

export function requireTryAll(module: string): unknown | undefined {
  let fn: unknown | undefined = undefined;
  try {
    // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unsafe-assignment
    fn = require(module);
  } catch (error) {
    try {
      // Search global file
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code == 'MODULE_NOT_FOUND') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        fn = requireg(module);
      }
    } catch (error) {
      // Search by path
      // eslint-disable-next-line import/no-dynamic-require, @typescript-eslint/no-unsafe-assignment
      fn = require(path.resolve(module));
    }
  }
  return fn;
}
