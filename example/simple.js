var cap     = require('..');
var levelup = require('levelup');
var rimraf  = require('rimraf');

rimraf.sync(__dirname + '/db');
var db = levelup(__dirname + '/db');

var capped = cap(db, 'foo', 10);

for (var i = 0; i < 20; i++) {
  db.put('foo!' + (100 + i), 'bar');
}

setTimeout(function () {
  var count = 0;
  db.createKeyStream().on('data', function (key) {
    console.log(++count + ': ' + key);
  });
}, 1000);
