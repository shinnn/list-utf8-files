'use strict';

const isUtf8 = require('is-utf8');
const enumerateFiles = require('enumerate-files');
const readChunkSync = require('read-chunk').sync;

function isFileUtf8(path) {
  return isUtf8(readChunkSync(path, 0, 4));
}

function filterUtf8Files(filePaths) {
  return new Set(Array.from(filePaths).filter(isFileUtf8));
}

module.exports = function listUtf8Files(dir, options) {
  return enumerateFiles(dir, options).then(filterUtf8Files);
};
