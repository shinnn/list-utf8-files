'use strict';

const {join} = require('path');
const {mkdir, writeFile} = require('fs');
const {promisify} = require('util');

const listUtf8File = require('.');
const rmfr = require('rmfr');
const test = require('tape');

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

test('listUtf8File()', async t => {
  t.plan(7);

  const tmp = join(__dirname, 'tmp');

  await rmfr(tmp);
  await promisifiedMkdir(tmp);
  await Promise.all([
    promisifiedWriteFile(join(tmp, 'empty-file'), ''),
    promisifiedWriteFile(join(tmp, '__non-utf8___'), Buffer.from([1, 2, 3])),
    promisifiedWriteFile(join(tmp, '2'), 'a'),
    promisifiedWriteFile(join(tmp, '10'), 'b'),
    promisifiedMkdir(join(tmp, '__dir__'))
  ]);

  listUtf8File(tmp, {numeric: true}).then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    t.deepEqual([...files], [
      '2',
      '10',
      'empty-file'
    ].map(path => join(tmp, path)), 'should list directories in a given directory.');
  }).catch(t.fail);

  listUtf8File('not-found').catch(err => {
    t.equal(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  listUtf8File([0, 1]).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected a directory path (string), but got [ 0, 1 ] (array).',
      'should fail when it takes a non-string path.'
    );
  });

  listUtf8File('Hi', 0).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: The second argument of readdir-sorted must be a plain object, but got 0 (number).',
      'should fail when it takes a non-object option.'
    );
  });

  listUtf8File().catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got no arguments.',
      'should fail when it takes no arguments.'
    );
  });

  listUtf8File(1, 2, 3).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected 1 or 2 arguments (path: String[, options: Object]), but got 3 arguments.',
      'should fail when it takes too many arguments.'
    );
  });
});
