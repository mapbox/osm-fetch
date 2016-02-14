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
 -c, --creation	Find references that existed at the requested feature's creation time.
               	Default behavior without this flag is to find references that existed
               	immediately prior to the creation of a new version, or in other words,
               	the final state of the requested version of the feature
 -v, --verbose	Print a timestamp for the data returned

Examples:
  $ osm-fetch relation 2453564 1
  $ osm-fetch relation 2453564 --shallow
  $ osm-fetch relation 2453564 1 --creation
```

## Understanding timestamps

The default behavior is to fetch the **final** state of a particular version. If
the requested version is the most recent for the feature, then the most current
versions of references will be included in the response. However if there is a
more recent version, then the response will include the state of all references
that existed **just prior** to the creation of the new version.

You can choose an alternative behavior by setting the `--creation` flag. With this
flag set, the response will include the state of references at the **creation**
time for the requested version.

To understand these distinctions, consider the following scenario:

- way 1234 includes nodes 1, 2, and 3
- way 1234 v2 is created at 2016-02-14T00:00:00Z
- at this time, the nodes are all v1
- nodes 2 and 3 are updated to v2 and twice to v3, respectively
- way 1234 is updated to v3 at 2016-02-14T02:00:00Z

When requesting way 1234 v2 via `osm-fetch`, the default behavior will
return the **final** state of the way, _just prior_ to 2016-02-14T02:00:00Z,
that is:
- way 1234 v2
- node 1 v1
- node 2 v2
- node 3 v3

By specifying the `--creation` flag, you'll receive data as it existed at the
**creation** time for v2, that is, at 2016-02-14T00:00:00Z. You'll receive:
- way 1234 v2
- node 1 v1
- node 2 v1
- node 3 v1

If you're curious, specifying the `--verbose` flag will print the timestamp that
the response data represents to stderr.

## Shallow mode

Specifying the `--shallow` flag will **always** fetch the most current version,
and if the feature is a relation, any member relations **will not** have their
members resolved. This mode offers no configurability, but is much faster because
it only requires a single request against the OpenStreetMap API. Generally, this
will provide enough data to build the most current geometry of a particular
feature.

Also note that `--shallow` mode is incompatible with the `--creation` flag.
