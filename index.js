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

function full(baseUrl, type, id, version, callback) {
  var client = osm(baseUrl);

  if (typeof version === 'function') {
    callback = version;
    version = null;
  }

  client.fetch(type, id, version, function(err, parent) {
    if (err) return callback(err);
    var xmls = [parent];

    function fetchRefs(element, callback) {
      var timestamp = +new Date(element.timestamp);
      var queue = async();

      element.refs.forEach(function(ref) {
        queue.defer(function(next) {
          client.fetchVersionAt(ref.type, ref.id, timestamp, function(err, xml) {
            if (err) return next(err);

            xmls.push(xml);

            parse(xml, function(err, elements) {
              if (err) {
                err.statusCode = 500;
                return callback(err);
              }

              fetchRefs(elements[0], next);
            });
          });
        });
      });

      queue.awaitAll(callback);
    }

    parse(parent, function(err, elements) {
      if (err) {
        err.statusCode = 500;
        return callback(err);
      }

      fetchRefs(elements[0], function(err) {
        if (err) return callback(err);

        aggregate(xmls, callback);
      });
    });
  });
}
