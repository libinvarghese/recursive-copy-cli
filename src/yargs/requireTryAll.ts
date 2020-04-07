import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireg = require('requireg');

export function requireTryAll(module: string): unknown | undefined {
  let fn: unknown | undefined = undefined;
  try {
    fn = require(module);
  } catch (error) {
    try {
      // Search global file
      if (error.code == 'MODULE_NOT_FOUND') {
        fn = requireg(module);
      }
    } catch (error) {
      // Search by path
      fn = require(path.resolve(module));
    }
  }
  return fn;
}
