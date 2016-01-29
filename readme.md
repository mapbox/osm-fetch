# osm-fetch

[![Build Status](https://travis-ci.org/mapbox/osm-fetch.svg?branch=master)](https://travis-ci.org/mapbox/osm-fetch)

Fetch XML representing a single version of a single feature from OpenStreetMap. All
references required to create a complete geometry are included. The appropriate
versions of references are selected based on the timestamp of the desired version
of the requested feature.

If no version number is specified, the most recent available version is retrieved.

Specifying the `--shallow` flag will **always** fetch the most current version,
and if the feature is a relation, any member relations **will not** have their
members resolved.

## Install

```
$ npm install -g osm-fetch
```

## Usage

```
Usage: osm-fetch <type> <id> [version] [--shallow]

Options:
 -s, --shallow	Fetch XML for the most recent version and do not resolve member relations

Examples:
  $ osm-fetch relation 2453564 1
  $ osm-fetch relation 2453564 --shallow
```
