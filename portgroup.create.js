#!/usr/bin/env node
'use strict';
const apiClient = require('./api.Client');
const params = require('./params.json');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

// colours
const chalk = require('chalk');
const red = chalk.bold.red;
const orange = chalk.keyword('orange');
const green = chalk.green;
const blue = chalk.blueBright;

// called from shell
const args = process.argv;
if(args[1].match(/portgroup/g)) {
	if(args[2] && args[3]) {
		main(args[2], args[3], args[4]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('portgroup.create <vswitch.id> <portgroup.name> [ <vlan.id> ]'));
	}
}

// main
function main(id, pgName, vlanId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vswitch = root.get(id);
		let pgSpec = require('./spec/trunk.DVPortgroupConfigSpec.json');
		pgSpec.name = pgName;
		if(vlanId) { // specific tag requested, override default of trunk
			pgSpec.defaultPortConfig.vlan = {
				"discriminator": "VmwareDistributedVirtualSwitchVlanIdSpec",
				"inherited": false,
				"vlanId": parseInt(vlanId)
			};
		}
		//console.log(JSON.stringify(pgSpec, null, "\t"));
		vswitch.createPortgroup(pgSpec).then((pg) => {
			console.log(JSON.stringify(pg.entity, null, "\t"));
		});
	});
}
