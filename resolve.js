#!/usr/bin/env node
/*
	This module takes a JSON body and recursively inserts discriminators based on defs
	Required for parsing HostNetworkConfig to make changes
*/

// Linking
var defs = {
	HostNetworkConfig: {
		proxySwitch: 'HostProxySwitchConfig'
	},
	HostProxySwitchConfig: {
		spec: 'HostProxySwitchSpec'
	},
	HostProxySwitchSpec: {
		backing: 'DistributedVirtualSwitchHostMemberPnicBacking'
	},
	DistributedVirtualSwitchHostMemberPnicBacking: {
		pnicSpec: 'DistributedVirtualSwitchHostMemberPnicSpec'
	}
}

// called from shell
var spec = require('./config/proxy.json');
var netSpec = main(spec, 'HostNetworkConfig');
console.log(JSON.stringify(netSpec, null, "\t"));

function main(spec, type) {
	console.log(JSON.stringify(spec));
	let result = isSpec(spec, type);
	return result;
}

function isSpec(spec, type) {
	let body = {};
	if(typeof(spec.discriminator) !== 'undefined') { // override if present
		type = spec.discriminator;
	} else {
		// insert discriminator if missing
		body.discriminator = type;
	}

	// resolve body
	Object.entries(spec).forEach((item) => {
		if(item[0] != 'discriminator') {
			if(typeof(item[1]) === 'object') {
				let child = type.toString();
				if(typeof(defs[type]) !== 'undefined' && typeof(defs[type][item[0]]) !== 'undefined') {
					child = defs[type][item[0]];
				}
				if(Array.isArray(item[1])) { // Array
					body[item[0]] = [];
					item[1].forEach((value) => { // forEach item in array
						body[item[0]].push(isSpec(value, child));
					});
				} else { // Object
					body[item[0]] = isSpec(item[1], child);
				}
			} else {
				body[item[0]] = item[1];
			}
		}
	});
	return body;
}
