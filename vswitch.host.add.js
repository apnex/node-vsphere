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
if(args[1].match(/vswitch/g)) {
	if(args[2] && args[3]) {
		main(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vswitch.addhost <vswitch.id> <host.id>'));
	}
}

// main
function main(id, hostId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vswitch = root.get(id);
		let host = root.get(hostId);
		vswitch.config().then((config) => {
			let configVersion = config.configVersion;
			let cSpec = {
				"discriminator": "VMwareDVSConfigSpec",
				"configVersion": configVersion,
				"host": [
					{
						"discriminator": "DistributedVirtualSwitchHostMemberConfigSpec",
						"host": {
							"discriminator": "ManagedObjectReference",
							"type": "HostSystem",
							"value": hostId
						},
						"operation": "add"
					}
				]
			};
			return vswitch.reconfigure(cSpec);
		}).then((info) => {
			console.log(JSON.stringify(info, null, "\t"));
		}).catch((error) => {
			console.log('An error occurred');
		});
	});
}
