var mockOsm = require('./mock-osm');
var aggregate = require('../lib/aggregate');

mockOsm.test('[aggregate] invalid xml', function(assert) {
  var xmls = ['invalid'];
  aggregate(xmls, function(err) {
    assert.equal(err.statusCode, 500, 'expected statusCode');
    assert.end();
  });
});
