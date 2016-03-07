var mockOsm = require('./mock-osm');
var full = require('..').full;
var shallow = require('..').shallow;
var at = require('..').at;
var fs = require('fs');
var path = require('path');

mockOsm.test('[index.full] element does not exist', function(assert) {
  full(mockOsm.baseUrl, 'way', 1, 2, function(err) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] failure to parse parent xml', function(assert) {
  full(mockOsm.baseUrl, 'node', 1, 3, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] failure to parse child xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 999, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] failure to parse history xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 998, 1, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] nested ref timestamps relative to top-level parent', function(assert) {
  full(mockOsm.baseUrl, 'relation', 1234, 1, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349416799999, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.1234.1.final.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] history endpoint failure', function(assert) {
  full(mockOsm.baseUrl, 'relation', 12345, 1, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] no duplicate items in closed way', function(assert) {
  full(mockOsm.baseUrl, 'way', 362662527, 1, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.ok(Date.now() - timestamp < 100, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'way.362662527.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.shallow]', function(assert) {
  shallow(mockOsm.baseUrl, 'relation', 2453564, function(err, xml) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.at]', function(assert) {
  at(mockOsm.baseUrl, 'relation', 1234, 1349407800000, function(err, xml) {
    assert.ifError(err, 'success');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.1234.1.creation.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.at] element does not exist', function(assert) {
  at(mockOsm.baseUrl, 'way', 1, 1349407800000, function(err) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.at] element did not exist at requested time', function(assert) {
  at(mockOsm.baseUrl, 'relation', 1234, 1349405000000, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});
