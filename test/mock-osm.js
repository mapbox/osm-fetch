var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var tape = require('tape');

var fixtures = fs.readdirSync(path.join(__dirname, 'fixtures'));

var server = http.createServer(function(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 400;
    return res.end();
  }

  var uri = url.parse(req.url);
  var pattern = /^\/api\/0.6\/(node|way|relation)\/(\d+)(\/(\d+|history))?$/;
  var match = uri.pathname.match(pattern);

  function doesNotExist() {
    res.statusCode = 404;
    res.end();
  }

  if (!match) return doesNotExist();
  var type = match[1];
  var id = Number(match[2]);
  var version = match[4];
  version = version === 'history' ? version : Number(version);

  if (type === 'way' && id === 123) {
    return res.socket.destroy();
  }

  var re = new RegExp('^' + [type, id].join('.') + '.+\.xml$');
  var xmls = fixtures.filter(function(filename) {
    return re.test(filename);
  });

  if (xmls.length === 0) return doesNotExist();

  if (version) {
    var filename = path.join(__dirname, 'fixtures', [type, id, version].join('.') + '.xml');
    if (!fs.existsSync(filename)) return doesNotExist();

    res.setHeader('Content-type', 'application/xml');
    return res.end(fs.readFileSync(filename, 'utf8'));
  }

  else {
    var xml = xmls.reduce(function(xml, filename) {
      var version = filename.split('.')[2];
      if (version === 'history') return xml;

      if (version > xml.version) xml = {
        version: version,
        filepath: path.join(__dirname, 'fixtures', filename)
      };

      return xml;
    }, { version: 0 });

    res.setHeader('Content-type', 'application/xml');
    return res.end(fs.readFileSync(xml.filepath, 'utf8'));
  }

  res.statusCode = 500;
  res.end();
});

module.exports = {
  baseUrl: 'http://localhost:20009',
  test: function(name, callback) {
    tape(name, function(assert) {
      server.listen(20009, function(err) {
        if (err) throw err;

        var end = assert.end.bind(assert);

        assert.end = function(err) {
          server.close(function(cl) {
            if (cl) throw cl;
            if (err) return end(err);
            end();
          });
        };

        callback(assert);
      });
    });
  }
};
