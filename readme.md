# osm-fetch

[![Build Status](https://travis-ci.org/mapbox/osm-fetch.svg?branch=master)](https://travis-ci.org/mapbox/osm-fetch)

Fetch XML representing a single version of a single feature from OpenStreetMap.
All references required to complete the feature are included. The appropriate
versions of references are selected based on the timestamp of the desired version
of the requested feature. If no version number is specified, the most recent data
available is retrieved.

## Install

```
$ npm install -g osm-fetch
```

## Usage

```
Usage: osm-fetch [OPTIONS] <type> <id> [version]

Options:
 -s, --shallow	Fetch XML for the most recent version and do not resolve member relations
 -t, --timestamp	Find references that existed at the requested time (in ms).

Examples:
  # Fetch the most recent version of relation 2453564
  $ osm-fetch relation 2453564

  # Fetch version 1 of relation 2453564
  $ osm-fetch relation 2453564 --version 1

  # Fetch relation 2453564 at 2012-10-05T04:00:00Z
  $ osm-fetch relation 2453564 --timestamp 1349409600000

  # Shallow fetch of the most recent version of relation 2453564
  $ osm-fetch relation 2453564 --shallow
```

## Shallow mode

Specifying the `--shallow` flag will **always** fetch the most current version,
and if the feature is a relation, any member relations **will not** have their
members resolved. This mode offers no configurability, but is much faster because
it only requires a single request against the OpenStreetMap API. Generally, this
will provide enough data to build the most current geometry of a particular
feature.

Also note that `--shallow` mode is incompatible with the `--creation` flag.
