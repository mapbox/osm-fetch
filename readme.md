# osm-fetch

[![Build Status](https://travis-ci.org/mapbox/osm-fetch.svg?branch=master)](https://travis-ci.org/mapbox/osm-fetch)

Fetch XML representing a single version of a single feature from OpenStreetMap. All
references required to create a complete geometry are included. The appropriate
versions of references are selected based on the timestamp of the desired version
of the requested feature.

If no version number is specified, the most recent available version is retrieved.

## Install

```
$ npm install -g osm-fetch
```

## Usage

```
Usage: osm-fetch <type> <id> [version]

Example:
  $ osm-fetch relation 2453564 1
```
