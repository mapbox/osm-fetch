var mockOsm = require('./mock-osm');
var parse = require('../lib/parse');
var fs = require('fs');
var path = require('path');

mockOsm.test('[parse] node', function(assert) {
  var fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'node.3668963800.1.xml'));
  parse(fixture, function(err, elements) {
    assert.ifError(err, 'success');
    assert.deepEqual(elements, [
      {
        changeset: '32913890',
        id: '3668963800',
        lat: '30.3175696',
        lon: '-9.5189366',
        refs: [],
        timestamp: '2015-07-27T17:02:51Z',
        type: 'node',
        uid: '3014908',
        user: 'Baldr',
        version: '1',
        visible: 'true'
      }
    ], 'expected elements parsed');
    assert.end();
  });
});

mockOsm.test('[parse] node history', function(assert) {
  var fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'node.3668963800.history.xml'));
  parse(fixture, function(err, elements) {
    assert.ifError(err, 'success');
    assert.deepEqual(elements, [
      {
        changeset: '32913890',
        id: '3668963800',
        lat: '30.3175696',
        lon: '-9.5189366',
        refs: [],
        timestamp: '2015-07-27T17:02:51Z',
        type: 'node',
        uid: '3014908',
        user: 'Baldr',
        version: '1',
        visible: 'true'
      },
      {
        changeset: '36252741',
        id: '3668963800',
        lat: '30.3178716',
        lon: '-9.5189928',
        refs: [],
        timestamp: '2015-12-29T23:12:35Z',
        type: 'node',
        uid: '2209556',
        user: 'Aboudrar Said',
        version: '2',
        visible: 'true'
      },
      {
        changeset: '36252881',
        id: '3668963800',
        lat: '30.3178716',
        lon: '-9.5189928',
        refs: [],
        timestamp: '2015-12-29T23:23:07Z',
        type: 'node',
        uid: '2209556',
        user: 'Aboudrar Said',
        version: '3',
        visible: 'true'
      },
      {
        changeset: '36292081',
        id: '3668963800',
        lat: '30.3178716',
        lon: '-9.5189928',
        refs: [],
        timestamp: '2016-01-01T02:00:03Z',
        type: 'node',
        uid: '2209556',
        user: 'Aboudrar Said',
        version: '4',
        visible: 'true'
      },
      {
        changeset: '36328548',
        id: '3668963800',
        lat: '30.3178716',
        lon: '-9.5189928',
        refs: [],
        timestamp: '2016-01-02T22:49:03Z',
        type: 'node',
        uid: '2209556',
        user: 'Aboudrar Said',
        version: '5',
        visible: 'true'
      }
    ], 'expected elements parsed');
    assert.end();
  });
});

mockOsm.test('[parse] way', function(assert) {
  var fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'way.184245798.1.xml'));
  parse(fixture, function(err, elements) {
    assert.ifError(err, 'success');
    assert.deepEqual(elements, [
      {
        changeset: '13368155',
        id: '184245798',
        refs: [
          { id: '1947033443', type: 'node' },
          { id: '1947033445', type: 'node' },
          { id: '1947033454', type: 'node' },
          { id: '1947033463', type: 'node' },
          { id: '1947033474', type: 'node' },
          { id: '1947033484', type: 'node' },
          { id: '1947033493', type: 'node' },
          { id: '1947033495', type: 'node' },
          { id: '1947033489', type: 'node' },
          { id: '1947033473', type: 'node' },
          { id: '1947033457', type: 'node' },
          { id: '1947033451', type: 'node' },
          { id: '1947033443', type: 'node' }
        ],
        timestamp: '2012-10-05T02:55:52Z',
        type: 'way',
        uid: '762332',
        user: 'Bleuet Mapper',
        version: '1',
        visible: 'true'
      }
    ], 'expected elements parsed');
    assert.end();
  });
});

mockOsm.test('[parse] relation', function(assert) {
  var fixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'relation.2453564.1.xml'));
  parse(fixture, function(err, elements) {
    assert.ifError(err, 'success');
    assert.deepEqual(elements, [
      {
        changeset: '13368155',
        id: '2453564',
        refs: [
          { id: '184246400', type: 'way' },
          { id: '184245798', type: 'way' }
        ],
        timestamp: '2012-10-05T03:00:08Z',
        type: 'relation',
        uid: '762332',
        user: 'Bleuet Mapper',
        version: '1',
        visible: 'true'
      }
    ], 'expected elements parsed');
    assert.end();
  });
});
