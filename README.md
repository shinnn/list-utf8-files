# list-utf8-files

[![npm version](https://img.shields.io/npm/v/list-utf8-files.svg)](https://www.npmjs.com/package/list-utf8-files)
[![Build Status](https://travis-ci.org/shinnn/list-utf8-files.svg?branch=master)](https://travis-ci.org/shinnn/list-utf8-files)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/list-utf8-files.svg)](https://coveralls.io/github/shinnn/list-utf8-files?branch=master)

List all [UTF-8](https://tools.ietf.org/html/rfc3629)-encoded files in a given directory

```javascript
const listUtf8Files = require('list-utf8-files');

/*
  ./dir/foo.txt: plain text file
  ./dir/node   : binary file
  ./dir/dir    : directory
  ./dir/bar.txt: empty file
*/

(async () => {
  await listUtf8Files('dir');
  /* Set {
    '/Users/example/dir/foo.txt',
    '/Users/example/dir/bar.txt'
  } */
})();
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install list-utf8-files
```

## API

```javascript
const listUtf8Files = require('list-utf8-files');
```

### listUtf8Files(*dir*)

*dir*: `string` (directory path)  
<!-- *options*: `Object` ([`readdir-sorted`](https://github.com/shinnn/readdir-sorted) options) -->  
Return: `Promise<Set<string>>`

The promise will be fulfilled with a [`Set`](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set) of strings — absolute paths of all [UTF-8-encoded](https://github.com/wayfind/is-utf8) files included in the given directory.

<!--
Options are directly passed to the underlying [`readdir-sorted`](https://github.com/shinnn/readdir-sorted#readdirsortedpath--options) to control the order of results.

```javascript
listDirectories('/dirs').then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/dirs/10'
  iterator.next().value; //=> '/dirs/2a'
  iterator.next().value; //=> '/dirs/2A'
});

listDirectories('/dirs', {
  numeric: true,
  caseFirst: 'upper'
}).then(files => {
  const iterator = files.keys();

  iterator.next().value; //=> '/dirs/2A'
  iterator.next().value; //=> '/dirs/2a'
  iterator.next().value; //=> '/dirs/10'
});
```
-->

## License

[Creative Commons Zero v1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/deed)
