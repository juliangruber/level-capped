var EventEmitter = require('events').EventEmitter;
var LiveStream = require('level-live-stream');
var SubLevel = require('level-sublevel');

module.exports = cap;

function cap (db, prefix, max) {
  var keys = [];

  if ('undefined' == typeof max) {
    max = prefix;
    prefix = null;
  }

  var ee = new EventEmitter;

  // only run one cleanup at a time
  var cleaning = false;
  var scheduled = false;

  function cleanup () {
    if (cleaning) return scheduled = true;

    scheduled = false;
    cleaning = true;

    var toDelete = keys.sort().splice(0, keys.length - max);
    var deleted = 0;

    for (var i = 0; i < toDelete.length; i++) {
      db.del(toDelete[i], function (err) {
        if (err) ee.emit('error', err);
        if (++deleted == toDelete.length) {
          cleaning = false;
          if (scheduled) cleanup();
        }
      });
    }
  }

  var opts = prefix
    ? { min : prefix, max : prefix + '~' }
    : {}

  SubLevel(db);
  var feed = LiveStream(db, opts);

  feed.on('data', function (update) {
    if (update.type != undefined && update.type != 'put') return;

    if (keys.indexOf(update.key) == -1) keys.push(update.key);
    if (keys.length > max) cleanup();
  });

  ee.end = feed.destroy.bind(feed);

  return ee;
}
