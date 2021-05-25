import type { Buffer } from 'buffer';
import type { Stats } from 'fs';
import type { Transform } from 'stream';
// eslint-disable-next-line node/no-unpublished-import
import through2 from 'through2';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export = function caseTransform(src: string, _dest: string, _stats: Stats): Transform {
  // If 'js' file transform to lowerCase
  if (src.endsWith('spec.ts')) {
    return through2(function (
      chunk: Readonly<Buffer>,
      _encoding: string,
      callback: (error?: Error, data?: unknown) => void
    ) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.push(chunk.toString().toLowerCase());
      callback();
    });
  }

  // transform to upperCase
  return through2(function (
    chunk: Readonly<Buffer>,
    _encoding: string,
    callback: (error?: Error, data?: unknown) => void
  ) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    this.push(chunk.toString().toUpperCase());
    callback();
  });
};
