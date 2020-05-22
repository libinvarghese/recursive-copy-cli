'use strict';

const through2 = require('through2');
const eol = require('eol');

module.exports = function eolTransform(src, _dest, _stats) {
  // transform to unix line endings \n
  return through2(function (chunk, _encoding, callback) {
    this.push(eol.crlf(chunk.toString()));
    callback();
  });
};
