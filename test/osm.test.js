var mockOsm = require('./mock-osm');
var osm = require('../lib/osm');
var fs = require('fs');
var path = require('path');

mockOsm.test('[fetch] a specific version of an element', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetch('node', 3668963800, 3, function(err, data) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'node.3668963800.3.xml'), 'utf8');
    assert.equal(expected, data, 'expected data returned');
    assert.end();
  });
});

mockOsm.test('[fetch] most recent version of an element', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetch('node', 3668963800, null, function(err, data) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'node.3668963800.5.xml'), 'utf8');
    assert.equal(expected, data, 'expected data returned');
    assert.end();
  });
});

mockOsm.test('[fetch] returns 500 for networking failures', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetch('way', 123, 456, function(err, data) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.notOk(data, 'no data returned');
    assert.end();
  });
});

mockOsm.test('[fetch] returns 404 for non-existent element', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetch('way', 1, 3, function(err, data) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.notOk(data, 'no data returned');
    assert.end();
  });
});

mockOsm.test('[fetchVersionAt] correct version for a specified timestamp', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetchVersionAt('node', 3668963800, 1451531387000, function(err, data) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'fixtures', 'node.3668963800.3.xml'), 'utf8');
    assert.equal(expected, data, 'expected data returned');
    assert.end();
  });
});

mockOsm.test('[fetchVersionAt] returns 404 for non-existent element', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetchVersionAt('way', 1, 1451531387000, function(err, data) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.notOk(data, 'no data returned');
    assert.end();
  });
});

mockOsm.test('[fetchVersionAt] returns 500 for failure to parse xml', function(assert) {
  var client = osm(mockOsm.baseUrl);
  client.fetchVersionAt('node', 1, 1451531387000, function(err, data) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.notOk(data, 'no data returned');
    assert.end();
  });
});
