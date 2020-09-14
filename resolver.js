#!/usr/bin/env node
/*
	This module takes a JSON body and recursively inserts discriminators based on resolve.defs.json file
	Required for parsing HostNetworkConfig and other Configs to make changes
*/
const defs = require('./resolver.defs.json');
module.exports = ((spec, type) => {
	return isSpec(spec, type);
});

function isSpec(spec, type) {
	let body = {};
	if(typeof(spec.discriminator) !== 'undefined') { // override if present
		type = spec.discriminator;
	} else { // insert discriminator
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
				if(Array.isArray(item[1])) { // Array - map values
					body[item[0]] = item[1].map((value) => {
						if(typeof(value) === 'object') { // only recurse objects
							return isSpec(value, child);
						} else {
							return value;
						}
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
