import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireg = require('requireg');

export function requireTryAll(module: string): unknown | undefined {
  let _fn: unknown | undefined = undefined;
  try {
    _fn = require(module);
  } catch (error) {
    try {
      // Search global file
      if (error.code == 'MODULE_NOT_FOUND') {
        _fn = requireg(module);
      }
    } catch (error) {
      // Search by path
      _fn = require(path.resolve(module));
    }
  }
  return _fn;
}
