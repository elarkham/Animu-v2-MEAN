#!/bin/env python
import argparse
from os   import walk
from Show import Show

### Headers ###
animu_headers = {'x-access-token':'***REMOVED***'}
hummingbird_headers = {'X-Client-Id': '***REMOVED***'}

### Arguments ###
parser = argparse.ArgumentParser()
parser.add_argument('-q', '--query', nargs='?', metavar='query', type=str, help='What the hummingbird query will be')
parser.add_argument('directory', metavar='directory', type=str, help='The directory that will be added')
parser.add_argument('-t', '--tags', nargs='*', metavar='tags', type=str, help='Defines the self.datas tags')
args = parser.parse_args()

### Show ###
show = Show( animu_headers, hummingbird_headers, args.directory, args.tags )
show.populate( args.query )
show.post()
