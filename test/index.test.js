var mockOsm = require('./mock-osm');
var full = require('..').full;
var shallow = require('..').shallow;
var fs = require('fs');
var path = require('path');

mockOsm.test('[index.full] (creationTime) gets all xml', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, { version: 1, creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349406008000, 'expected timestamp');
    fs.writeFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), xml);
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) version not included', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, { creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349406008000, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) element does not exist', function(assert) {
  full(mockOsm.baseUrl, 'way', 1, { version: 2, creationTime: true }, function(err) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) failure to parse parent xml', function(assert) {
  full(mockOsm.baseUrl, 'node', 1, { version: 3, creationTime: true }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) failure to parse child xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 999, { version: 1, creationTime: true }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) failure to parse history xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 998, { version: 1, creationTime: true }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) nested ref timestamps relative to top-level parent', function(assert) {
  full(mockOsm.baseUrl, 'relation', 1234, { version: 1, creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349406000000, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.1234.1.creation.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) no duplicate items in closed way', function(assert) {
  full(mockOsm.baseUrl, 'way', 362662527, { version: 1, creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1438032946000, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'way.362662527.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) gets all xml', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, { version: 1, creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349406008000, 'expected timestamp');
    fs.writeFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), xml);
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (creationTime) version not included', function(assert) {
  full(mockOsm.baseUrl, 'relation', 2453564, { creationTime: true }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349406008000, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.2453564.1.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) element does not exist', function(assert) {
  full(mockOsm.baseUrl, 'way', 1, { version: 2 }, function(err) {
    assert.equal(err.statusCode, 404, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) failure to parse parent xml', function(assert) {
  full(mockOsm.baseUrl, 'node', 1, { version: 3 }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) failure to parse child xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 999, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) failure to parse history xml', function(assert) {
  full(mockOsm.baseUrl, 'way', 998, { version: 1 }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) nested ref timestamps relative to top-level parent', function(assert) {
  full(mockOsm.baseUrl, 'relation', 1234, { version: 1 }, function(err, xml, timestamp) {
    assert.ifError(err, 'success');
    assert.equal(timestamp, 1349416799999, 'expected timestamp');
    var expected = fs.readFileSync(path.resolve(__dirname, 'expected', 'relation.1234.1.final.xml'), 'utf8').trim();
    assert.equal(xml, expected, 'expected output xml');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) history endpoint failure', function(assert) {
  full(mockOsm.baseUrl, 'relation', 12345, { version: 1 }, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});

mockOsm.test('[index.full] (finalTime) no duplicate items in closed way', function(assert) {
  full(mockOsm.baseUrl, 'way', 362662527, { version: 1 }, function(err, xml, timestamp) {
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
