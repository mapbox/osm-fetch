var mockOsm = require('./mock-osm');
var full = require('..').full;
var shallow = require('..').shallow;
var fs = require('fs');
var path = require('path');

mockOsm.test('[index] gets all xml', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, 1, function(err, xml) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index] version not included', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, function(err, xml) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index] element does not exist', function(assert) {
  full(mockOsm.baseUrl, 'way', 1, 2, function(err) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index] failure to parse parent xml', function(assert) {
  full(mockOsm.baseUrl, 'node', 1, 3, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index] failure to parse child xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 999, 1, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index] failure to parse history xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 998, 1, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index] shallow fetch', function(assert) {
  shallow(mockOsm.baseUrl, 'relation', 2453564, function(err, xml) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});
