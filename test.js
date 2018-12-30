'use strict';

const {join} = require('path');
const {mkdir, writeFile} = require('fs');
const {promisify, types: {isSet}} = require('util');

const listUtf8File = require('.');
const rmfr = require('rmfr');
const test = require('tape');

const promisifiedMkdir = promisify(mkdir);
const promisifiedWriteFile = promisify(writeFile);

test('listUtf8File()', async t => {
	t.plan(3);

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

	(async () => {
		const files = await listUtf8File(tmp, {
			encoding: 'buffer',
			numeric: true
		});

		t.ok(isSet(files), 'should be fulfilled with a Set instance.');
		t.deepEqual([...files], [
			'2',
			'10',
			'empty-file'
		].map(path => Buffer.from(join(tmp, path))), 'should list directories in a given directory.');
	})();

	(async () => {
		try {
			await listUtf8File(Buffer.from('not-found'));
		} catch ({code}) {
			t.equal(code, 'ENOENT', 'should fail when it cannot find the directory.');
		}
	})();
});

test('Argument validation', async t => {
	const fail = t.fail.bind(t, 'Unexpectedly succeeded.');

	try {
		await listUtf8File([0, 1]);
		fail();
	} catch ({code}) {
		t.equal(
			code,
			'ERR_INVALID_ARG_TYPE',
			'should fail when it takes an invalid path type.'
		);
	}

	try {
		await listUtf8File('Hi', 0);
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected a plain <Object> to set readdir-sorted options, but got 0 (number).',
			'should fail when it takes a non-object option.'
		);
	}

	try {
		await listUtf8File();
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got no arguments.',
			'should fail when it takes no arguments.'
		);
	}

	try {
		await listUtf8File('.', {}, {});
		fail();
	} catch (err) {
		t.equal(
			err.toString(),
			'TypeError: Expected 1 or 2 arguments (path: <string|Buffer|URL>[, options: <Object>]), but got 3 arguments.',
			'should fail when it takes too many arguments.'
		);
	}

	t.end();
});
