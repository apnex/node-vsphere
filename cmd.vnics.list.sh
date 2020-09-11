#!/bin/bash
if [[ $(realpath ${0}) =~ ^(.*)/([^/]+)$ ]]; then
	WORKDIR="${BASH_REMATCH[1]}"
	FILE="${BASH_REMATCH[2]}"
	if [[ ${FILE} =~ ^[^.]+[.](.+)[.]sh$ ]]; then
		TYPE="${BASH_REMATCH[1]}"
	fi
fi
JQDIR=${WORKDIR}/tpl
source ${WORKDIR}/mod.core

function run {
	local HOSTID="${1}"
	local INPUT=$(./host.network.info.js "${HOSTID}" 2>/dev/null)
	local TEMPLATE="${JQDIR}/tpl.${TYPE}.jq"
	if [[ -f "${TEMPLATE}" ]]; then
		local PAYLOAD=$(echo "${INPUT}" | jq -f ${JQDIR}/tpl.${TYPE}.jq)
		buildTable "${PAYLOAD}"
	fi
}

if [[ -n "${1}" ]]; then
	run "${@}"
else
	printf "[$(corange "ERROR")]: Usage: $(cgreen "vnics.list") $(ccyan "<host.id>")\n" 1>&2
fi

