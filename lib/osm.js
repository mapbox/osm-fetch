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
      var uri = [baseUrl, 'api/0.6', type, id, version].join('/');

      get(uri, callback);
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
            return +new Date(ele.timestamp) < timestamp;
          })[0];

          var uri = [baseUrl, 'api/0.6', ele.type, ele.id, ele.version].join('/');
          get(uri, callback);
        });
      });
    }
  };
};