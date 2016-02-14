var request = require('request');
var parse = require('./parse');

function get(uri, callback) {
  request(uri, function(err, res, body) {
    if (err) {
      err.statusCode = 500;
      return callback(err);
    }

    if (res.statusCode !== 200) {
      err = new Error(body);
      err.statusCode = res.statusCode;
      return callback(err);
    }

    callback(null, body);
  });
}

module.exports = function(baseUrl) {
  return {
    fetch: function(type, id, version, callback) {
      var uri = [baseUrl, 'api/0.6', type, id];
      if (version) uri.push(version);

      get(uri.join('/'), callback);
    },

    finalTimestamp: function(type, id, version, callback) {
      var uri = [baseUrl, 'api/0.6', type, id, 'history'].join('/');

      get(uri, function(err, history) {
        if (err) return callback(err);

        parse(history, function(err, elements) {
          if (err) {
            err.statusCode = 500;
            return callback(err);
          }

          var timestamps = elements.reduce(function(timestamps, ele) {
            timestamps[ele.version.toString()] = +new Date(ele.timestamp);
            return timestamps;
          }, {});

          var nextTimestamp = timestamps[(version + 1).toString()];
          if (!nextTimestamp) return callback(null, Date.now());
          return callback(null, nextTimestamp - 1);
        });
      });
    },

    fetchVersionAt: function(type, id, timestamp, callback) {
      var uri = [baseUrl, 'api/0.6', type, id, 'history'].join('/');

      get(uri, function(err, history) {
        if (err) return callback(err);

        parse(history, function(err, elements) {
          if (err) {
            err.statusCode = 500;
            return callback(err);
          }

          var ele = elements.reverse().filter(function(ele) {
            return +new Date(ele.timestamp) <= timestamp;
          })[0];

          if (!ele) {
            err = new Error('No version of ' + type + '!' + id + ' existed at ' + new Date(timestamp));
            err.statusCode = 500;
            return callback(err);
          }

          var uri = [baseUrl, 'api/0.6', ele.type, ele.id, ele.version].join('/');
          get(uri, callback);
        });
      });
    },

    fetchShallow: function(type, id, callback) {
      var uri = [baseUrl, 'api/0.6', type, id, 'full'];
      get(uri.join('/'), callback);
    }
  };
};
