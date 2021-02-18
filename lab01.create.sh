#!/bin/bash
## turn this into terraform

LABID="1"
LABVA="resgroup-v27"
LABDS="datastore-15"
LABPG="dvportgroup-23"

for ID in {6..6}; do
	echo ${LABID}${ID}
	./esx.create.js ${LABID}${ID} ${LABVA} ${LABDS} ${LABPG}
done
