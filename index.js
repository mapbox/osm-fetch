var osm = require('./lib/osm');
var parse = require('./lib/parse');
var aggregate = require('./lib/aggregate');
var async = require('queue-async');

module.exports.full = full;
module.exports.shallow = shallow;

function shallow(baseUrl, type, id, callback) {
  var client = osm(baseUrl);
  client.fetchShallow(type, id, callback);
}

function full(baseUrl, type, id, options, callback) {
  var client = osm(baseUrl);

  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  var version = options.version;
  var creationTime = options.creationTime;

  client.fetch(type, id, version, function(err, parent) {
    if (err) return callback(err);
    var xmls = [parent];
    var timestamp;

    function fetchRefs(element, callback) {
      var queue = async();

      element.refs.forEach(function(ref) {
        queue.defer(function(next) {
          client.fetchVersionAt(ref.type, ref.id, timestamp, function(err, xml) {
            if (err) return next(err);

            xmls.push(xml);

            parse(xml, function(err, elements) {
              if (err) {
                err.statusCode = 500;
                return next(err);
              }

              fetchRefs(elements[0], next);
            });
          });
        });
      });

      queue.awaitAll(callback);
    }

    function allDone(err) {
      if (err) return callback(err);
      aggregate(xmls, function(err, result) {
        callback(err, result, timestamp);
      });
    }

    parse(parent, function(err, elements) {
      if (err) {
        err.statusCode = 500;
        return callback(err);
      }

      if (!version) version = elements[0].version;

      if (creationTime) {
        timestamp = +new Date(elements[0].timestamp);
        fetchRefs(elements[0], allDone);
      } else {
        client.finalTimestamp(type, id, version, function(err, finalTimestamp) {
          if (err) return callback(err);
          timestamp = finalTimestamp;
          fetchRefs(elements[0], allDone);
        });
      }
    });
  });
}
