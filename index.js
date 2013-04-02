var livefeed = require('level-livefeed');
var EventEmitter = require('events').EventEmitter;

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

    keys.sort();

    var toDelete = [];
    while (keys.length - max) {
      toDelete.push(keys.shift());
    }

    var key;
    while (key = toDelete.shift()) {
      db.del(key, function (err) {
        if (err) ee.emit('error', err);
        if (!toDelete.length) {
          cleaning = false;
          if (scheduled) cleanup();
        }
      });
    }
  }

  var opts = prefix
    ? { start : prefix, end : prefix + '~' }
    : {}

  var feed = livefeed(db, opts);

  feed.on('data', function (update) {
    if (update.type != 'put') return;

    keys.push(update.key);
    if (keys.length > max) cleanup();
  });

  ee.end = feed.destroy.bind(feed);

  return ee;
}
