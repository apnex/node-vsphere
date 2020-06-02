#!/bin/bash

if [[ -n ${1} ]]; then
	./esx.create.js ${1} resgroup-v328 datastore-55 dvportgroup-319
else
	printf "Usage: <esx-node-id>\n"
fi
