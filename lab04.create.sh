#!/bin/bash
## turn this into terraform

LABID="4"
LABVA="resgroup-v1087"
LABDS="datastore-1021"
LABPG="dvportgroup-1022"

for ID in {7..7}; do
	echo ${LABID}${ID}
	./esx.create.js ${LABID}${ID} ${LABVA} ${LABDS} ${LABPG}
done
