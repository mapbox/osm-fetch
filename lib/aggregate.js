var async = require('queue-async');
var xml2js = require('xml2js');

module.exports = function(xmls, callback) {
  var queue = async();

  var types = {
    node: [],
    way: [],
    relation: []
  };

  var index = {
    node: {},
    way: {},
    relation: {}
  };

  xmls.map(function(xml) {
    queue.defer(function(next) {
      xml2js.parseString(xml, function(err, parsed) {
        if (err) return next(err);

        var type = Object.keys(parsed.osm)[1];
        var data = parsed.osm[type];
        var id = data[0].$.id;

        var builder = new xml2js.Builder({
          rootName: type,
          headless: true,
          renderOpts: { pretty: false }
        });

        if (!index[type][id]) {
          index[type][id] = true;
          types[type].push(builder.buildObject(data[0]));
        }

        next();
      });
    });
  });

  queue.awaitAll(function(err) {
    if (err) {
      err.statusCode = 500;
      return callback(err);
    }

    function byId(a, b) {
      a = a.match(/id="(\d+)"/)[1];
      b = b.match(/id="(\d+)"/)[1];
      return Number(a) - Number(b);
    }

    var output = '<?xml version=\'1.0\' encoding=\'UTF-8\'?><osm version="0.6" generator="osm-fetch">';
    types.node.sort(byId).forEach(function(node) { output += node; });
    types.way.sort(byId).forEach(function(way) { output += way; });
    types.relation.sort(byId).forEach(function(relation) { output += relation; });
    output += '</osm>';

    callback(null, output);
  });
};
