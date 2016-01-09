#!/usr/bin/env node

var fetch = require('..');
var args = process.argv.slice(2);

var baseUrl = 'https://www.openstreetmap.org';

if (!args[0] || !args[1] || !args[2]) {
  console.log('Usage: osm-fetch <type> <id> <version>');
  console.log('');
  console.log('Example:');
  console.log('  $ osm-fetch relation 2453564 1');
  console.log('');
  process.exit();
}

fetch(baseUrl, args[0], args[1], args[2], function(err, xmls) {
  if (err) throw err;
  console.log(xmls);
});
