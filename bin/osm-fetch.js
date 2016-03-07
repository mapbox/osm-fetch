#!/usr/bin/env node

var fetch = require('..');
var args = require('minimist')(process.argv.slice(2), {
  boolean: ['s', 'shallow']
});

var baseUrl = 'https://www.openstreetmap.org';

if (args.help || !args._[0] || !args._[1]) {
  console.log('Usage: osm-fetch [OPTIONS] <type> <id>');
  console.log('');
  console.log('Options:');
  console.log(' -v, --version\tFetch the specified version of the feature');
  console.log(' -t, --timestamp\tFind references that existed at the requested time (in ms).');
  console.log(' -s, --shallow\tFetch XML for the most recent version and do not resolve member relations');
  console.log('');
  console.log('Examples:');
  console.log('# Fetch the most recent version of relation 2453564');
  console.log('$ osm-fetch relation 2453564');
  console.log('');
  console.log('# Fetch version 1 of relation 2453564');
  console.log('$ osm-fetch relation 2453564 --version 1');
  console.log('');
  console.log('# Fetch relation 2453564 at 2012-10-05T04:00:00Z');
  console.log('$ osm-fetch relation 2453564 --timestamp 1349409600000');
  console.log('');
  console.log('# Shallow fetch of the most recent version of relation 2453564');
  console.log('$ osm-fetch relation 2453564 --shallow');
  console.log('');
  process.exit();
}

if ((args.s || args.shallow) && (args.t || args.timestamp)) {
  console.error(new Error('--shallow and --timestamp flags are incompatible'));
  process.exit(1);
}

if (args.s || args.shallow)
  return fetch.shallow(baseUrl, args._[0], args._[1], got);

var timestamp = args.t || args.timestamp;
var version = args.v || args.version;
if (version) version = Number(version);

if (timestamp) fetch.at(baseUrl, args._[0], Number(args._[1]), Number(timestamp), got);
else fetch.full(baseUrl, args._[0], args._[1], version, got);

function got(err, xmls) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  console.log(xmls);
}
