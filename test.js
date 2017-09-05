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
  t.plan(4);

  const tmp = join(__dirname, 'tmp');

  await rmfr(tmp);
  await promisifiedMkdir(tmp);
  await Promise.all([
    promisifiedWriteFile(join(tmp, 'empty-file'), ''),
    promisifiedWriteFile(join(tmp, 'non-utf8'), Buffer.from([1, 2, 3])),
    promisifiedWriteFile(join(tmp, '2'), 'a'),
    promisifiedWriteFile(join(tmp, '10'), 'b'),
    promisifiedMkdir(join(tmp, 'dir'))
  ]);

  listUtf8File(tmp).then(files => {
    t.ok(files instanceof Set, 'should be fulfilled with a Set instance.');

    t.deepEqual([...files].sort(), [
      '10',
      '2',
      'empty-file'
    ].map(path => join(tmp, path)), 'should list directories in a given directory.');
  }).catch(t.fail);

  listUtf8File('not-found').catch(err => {
    t.equal(err.code, 'ENOENT', 'should fail when it cannot find the directory.');
  });

  listUtf8File([0, 1]).catch(err => {
    t.equal(
      err.toString(),
      'TypeError: Expected a path of the directory (string), but got a non-string value [ 0, 1 ].',
      'should fail when it takes a non-string argument.'
    );
  });
});
