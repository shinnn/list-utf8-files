'use strict';

var isUtf8 = require('is-utf8');
var enumerateFiles = require('enumerate-files');
var readChunkSync = require('read-chunk').sync;
var toArray = require('lodash/fp/toArray');

function isFileUtf8(path) {
  return isUtf8(readChunkSync(path, 0, 4));
}

function filterUtf8Files(filePaths) {
  return new Set(toArray(filePaths).filter(isFileUtf8));
}

module.exports = function listUtf8Files(dir) {
  return enumerateFiles(dir).then(filterUtf8Files);
};
