
# level-capped

Capped collections for [LevelDB](https://github.com/rvagg/levelup).

Capping happens offline in order not to slow the main operations down.

[![Build Status](https://travis-ci.org/juliangruber/level-capped.png?branch=master)](https://travis-ci.org/juliangruber/level-capped)

## Usage

```js
var cap = require('level-capped');
var levelup = require('levelup');

var db = levelup(__dirname + '/db');

// cap the foo collection to 10 entries
var capped = cap(db, 'foo', 10);

// now insert data and eventually there will max. 10 entries
// in the foo collection
db.put('foo!01', 'bar');

// ...
```

## API

### cap(db[, prefix], max)

Let there never be more than `max` entries (that start with `prefix`).

### cap#end()

Stop capping.

## Installation

With [npm](http://npmjs.org) do

```bash
$ npm install level-capped
```

## License

(MIT)

Copyright (c) 2013 Julian Gruber &lt;julian@juliangruber.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
