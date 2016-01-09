# osm-fetch

Fetch XML representing a single version of a single feature from OpenStreetMap. All
references required to create a complete geometry are included. The appropriate
versions of references are selected based on the timestamp of the desired version
of the requested feature.

## Install

```
$ npm install -g osm-fetch
```

## Usage

```
Usage: osm-fetch <type> <id> <version>

Example:
  $ osm-fetch relation 2453564 1
```
