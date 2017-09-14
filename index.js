'use strict';

const enumerateFiles = require('enumerate-files');
const isFileUtf8 = require('is-file-utf8');

module.exports = async function listUtf8Files(...args) {
  const paths = await enumerateFiles(...args);
  const results = new Set();
  const promises = new Set();

  for (const path of paths) {
    promises.add(isFileUtf8(path));
  }

  const pathIterator = paths.values();

  for (const isUtf8 of await Promise.all(promises)) {
    if (isUtf8) {
      results.add(pathIterator.next().value);
    }
  }

  return results;
};
