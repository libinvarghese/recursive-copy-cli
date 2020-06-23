import { Stats } from 'fs';
import { Transform } from 'stream';
// eslint-disable-next-line node/no-unpublished-import
import through2 from 'through2';
// eslint-disable-next-line node/no-unpublished-import
import eol from 'eol';

export = function eolTransform(src: string, _dest: string, _stats: Stats): Transform {
  // If 'js' file transform to windows line endings \r\n
  if (src.endsWith('spec.ts')) {
    return through2(function (chunk: Buffer, _encoding: string, callback: (error?: Error, data?: unknown) => void) {
      this.push(eol.crlf(chunk.toString()));
      callback();
    });
  }

  // transform to unix line endings \n
  return through2(function (chunk: Buffer, _encoding: string, callback: (error?: Error, data?: unknown) => void) {
    this.push(eol.lf(chunk.toString()));
    callback();
  });
};
