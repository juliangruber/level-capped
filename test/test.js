var cap     = require('..');
var levelup = require('levelup');
var rimraf  = require('rimraf');
var tap     = require('tap');

test({
  name   : 'capped',
  input  : ['foo!100', 'foo!101', 'foo!102'],
  output : ['foo!101', 'foo!102'],
  create : function (db) { return cap(db, 'foo', 2) }
});

test({
  name   : 'miss',
  input  : ['bar!100', 'bar!101'],
  output : ['bar!100', 'bar!101'],
  create : function (db) { return cap(db, 'foo', 1) }
});

test({
  name   : 'uncapped',
  input  : ['foo!100', 'foo!101', 'foo!102'],
  output : ['foo!100', 'foo!101', 'foo!102'],
  create : function (db) { return cap(db, 'foo', 3) }
});

test({
  name   : 'no prefix',
  input  : ['foo!100', 'foo!101', 'foo!102'],
  output : ['foo!101', 'foo!102'],
  create : function (db) { return cap(db, 2) }
});

function test (opts) {
  tap.test(opts.name, function (t) {
    rimraf.sync(__dirname + '/db');
    var db = levelup(__dirname + '/db');

    var capped = opts.create(db);

    var written = 0;
    var toWrite = opts.input.length;

    for (var i = 0; i < toWrite; i++) (function (i) {
      db.put(opts.input[i], 'bar', function (err) {
        if (err) throw err;
        if (++written == toWrite) setTimeout(read, 500);
      });
    })(i);

    function read () {
      var keys = [];
      db.createKeyStream()
      .on('data', keys.push.bind(keys))
      .on('end', function () {
        t.deepEqual(keys, opts.output);
        db.close(function () {
          t.end();
        });
      });
    }
  });
}
