import path from 'path';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const requireg = require('requireg');

export function requireTryAll(module: string): ((filePath: string) => string) | undefined {
  let rename: ((filePath: string) => string) | undefined = undefined;
  try {
    rename = require(module);
  } catch (error) {
    try {
      // Search global file
      if (error.code == 'MODULE_NOT_FOUND') {
        rename = requireg(module);
      }
    } catch (error) {
      // Search by path
      rename = require(path.resolve(module));
    }
  }
  return rename;
}
