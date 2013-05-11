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

    var written = 0;
    var toWrite = opts.input.length;

    var ws = db.createWriteStream();
    for (var i = 0; i < toWrite; i++) {
      ws.write({ type : 'put', key : opts.input[i], value : 'bar'});
    }
    ws.end();
    ws.on('close', read);

    function read () {
      opts.create(db);
      setTimeout(function () {
        var keys = [];
        db.createKeyStream()
        .on('data', keys.push.bind(keys))
        .on('end', function () {
          t.deepEqual(keys, opts.output);
          db.close(function () {
            t.end();
          });
        });
      }, 500);
    }
  });
}
