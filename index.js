'use strict';

const isUtf8 = require('is-utf8');
const enumerateFiles = require('enumerate-files');
const readChunkSync = require('read-chunk').sync;

function isFileUtf8(path) {
  return isUtf8(readChunkSync(path, 0, 4));
}

function filterUtf8Files(filePaths) {
  return new Set([...filePaths].filter(isFileUtf8));
}

module.exports = async function listUtf8Files(...args) {
  return filterUtf8Files(await enumerateFiles(...args));
};
