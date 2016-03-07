var osm = require('./lib/osm');
var parse = require('./lib/parse');
var aggregate = require('./lib/aggregate');
var async = require('queue-async');

module.exports.full = full;
module.exports.shallow = shallow;
module.exports.at = at;

function shallow(baseUrl, type, id, callback) {
  var client = osm(baseUrl);
  client.fetchShallow(type, id, callback);
}

function at(baseUrl, type, id, timestamp, callback) {
  var client = osm(baseUrl);

  client.fetchVersionAt(type, id, timestamp, function(err, parent) {
    if (err) return callback(err);
    getRefs(client, parent, timestamp, callback);
  });
}

function full(baseUrl, type, id, version, callback) {
  var client = osm(baseUrl);

  if (typeof version === 'function') {
    callback = version;
    version = null;
  }

  client.fetch(type, id, version, function(err, parent) {
    if (err) return callback(err);
    getRefs(client, parent, null, callback);
  });
}

function getRefs(client, parent, timestamp, callback) {
  var xmls = [parent];

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

    if (timestamp) return fetchRefs(elements[0], allDone);
    client.finalTimestamp(elements[0].type, Number(elements[0].id), Number(elements[0].version), function(err, finalTimestamp) {
      if (err) return callback(err);
      timestamp = finalTimestamp;
      fetchRefs(elements[0], allDone);
    });
  });
}
