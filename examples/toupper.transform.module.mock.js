'use strict';
const through2 = require('through2');

/**
 * @param src string  Name of the source file
 * @param dest string Name of the dest file
 * @param stats fs.Stats stats of the src file
 *
 * @return TransformStream
 */
module.exports = function caseTransform(src, _dest, _stats) {
  return through2(function (chunk, _encoding, callback) {
    this.push(chunk.toString().toUpperCase());
    callback();
  });
};
