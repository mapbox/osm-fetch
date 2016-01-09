var sax = require('sax');

module.exports = function(xml, callback) {
  var parser = sax.createStream(true);

  var elements = [];
  var current;
  var complete = false;

  parser.on('error', function(err) {
    if (!complete) {
      callback(err);
      complete = true;
    }
  });

  parser.on('opentag', function(ele) {
    var name = ele.name.toLowerCase();
    var attrs = {};
    for (var k in ele.attributes) attrs[k.toLowerCase()] = ele.attributes[k];

    if (name === 'node' || name === 'way' || name === 'relation') {
      current = { type: name, refs: [] };
      for (k in attrs) current[k] = attrs[k];
    }

    if (name === 'nd' || name === 'member') {
      current.refs.push({
        type: attrs.type || 'node',
        id: attrs.ref
      });
    }
  });

  parser.on('closetag', function(name) {
    name = name.toLowerCase();
    if (name === 'node' || name === 'way' || name === 'relation') {
      elements.push(current);
    }
  });

  parser.on('end', function() {
    if (!complete) {
      callback(null, elements);
      complete = true;
    }
  });

  parser.write(xml);
  parser.end();
};
