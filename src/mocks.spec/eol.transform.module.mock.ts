// eslint-disable-next-line node/no-unpublished-import
import through2 from 'through2';
// eslint-disable-next-line node/no-unpublished-import
import eol from 'eol';
import type { Stats } from 'fs';
import type { Transform } from 'stream';

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export = function eolTransform(src: string, _dest: string, _stats: Stats): Transform {
  // If 'js' file transform to windows line endings \r\n
  if (src.endsWith('spec.ts')) {
    return through2(function (
      chunk: Readonly<Buffer>,
      _encoding: string,
      callback: (error?: Error, data?: unknown) => void
    ) {
      // eslint-disable-next-line @typescript-eslint/no-invalid-this
      this.push(eol.crlf(chunk.toString()));
      callback();
    });
  }

  // transform to unix line endings \n
  return through2(function (
    chunk: Readonly<Buffer>,
    _encoding: string,
    callback: (error?: Error, data?: unknown) => void
  ) {
    // eslint-disable-next-line @typescript-eslint/no-invalid-this
    this.push(eol.lf(chunk.toString()));
    callback();
  });
};
