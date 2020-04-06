// eslint-disable-next-line node/no-unpublished-import
import through2 from 'through2';
import { Stats } from 'fs';
import { Transform } from 'stream';

export = function caseTransform(src: string, _dest: string, _stats: Stats): Transform {
  // If 'js' file transform to lowerCase
  if (src.endsWith('spec.ts')) {
    return through2(function(chunk: Buffer, _encoding: string, callback: (error?: Error, data?: unknown) => void) {
      this.push(chunk.toString().toLowerCase());
      callback();
    });
  }

  // transform to upperCase
  return through2(function(chunk: Buffer, _encoding: string, callback: (error?: Error, data?: unknown) => void) {
    this.push(chunk.toString().toUpperCase());
    callback();
  });
};
