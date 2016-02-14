#!/usr/bin/env node

var fetch = require('..');
var args = require('minimist')(process.argv.slice(2), {
  boolean: ['s', 'shallow', 'c', 'creation', 'v', 'verbose']
});

var baseUrl = 'https://www.openstreetmap.org';

if (args.help || !args._[0] || !args._[1]) {
  console.log('Usage: osm-fetch <type> <id> [version] [--shallow]');
  console.log('');
  console.log('Options:');
  console.log(' -s, --shallow\tFetch XML for the most recent version and do not resolve member relations');
  console.log(' -c, --creation\tFind references that existed at the requested feature\'s creation time.');
  console.log('               \tDefault behavior without this flag is to find references that existed');
  console.log('               \timmediately prior to the creation of a new version, or in other words,');
  console.log('               \tthe final state of the requested version of the feature');
  console.log(' -v, --verbose\tPrint a timestamp for the data returned');
  console.log('');
  console.log('Examples:');
  console.log('  $ osm-fetch relation 2453564 1');
  console.log('  $ osm-fetch relation 2453564 --shallow');
  console.log('  $ osm-fetch relation 2453564 1 --creation');
  console.log('');
  process.exit();
}

if ((args.s || args.shallow) && (args.c || args.creation)) {
  console.error(new Error('--shallow and --creation flags are incompatible'));
  process.exit(1);
}

if (args.s || args.shallow)
  return fetch.shallow(baseUrl, args._[0], args._[1], got);

var options = {
  version: args._[2],
  creationTime: args.c || args.creation
};

fetch.full(baseUrl, args._[0], args._[1], options, got);

function got(err, xmls, timestamp) {
  if (err) {
    console.error(err);
    process.exit(1);
  }

  if (args.v || args.verbose) console.error('Fetched data for %s', (new Date(timestamp).toISOString()));

  console.log(xmls);
}
