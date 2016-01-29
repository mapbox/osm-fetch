#!/usr/bin/env node

var fetch = require('..');
var args = require('minimist')(process.argv.slice(2));

var baseUrl = 'https://www.openstreetmap.org';

if (args.help || !args._[0] || !args._[1]) {
  console.log('Usage: osm-fetch <type> <id> [version] [--shallow]');
  console.log('');
  console.log('Options:');
  console.log(' -s, --shallow\tFetch XML for the most recent version and do not resolve member relations');
  console.log('');
  console.log('Examples:');
  console.log('  $ osm-fetch relation 2453564 1');
  console.log('  $ osm-fetch relation 2453564 --shallow');
  console.log('');
  process.exit();
}

if (args.s || args.shallow) fetch.shallow(baseUrl, args._[0], args._[1], got);
else fetch.full(baseUrl, args._[0], args._[1], args._[2], got);

function got(err, xmls) {
  if (err) throw err;
  console.log(xmls);
}
