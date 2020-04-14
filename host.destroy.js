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
if(args[1].match(/host/g)) {
	if(args[2]) {
		main(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('host.destroy <host.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => {
		let host = root.get(id);
		host.enterMaintenanceMode().then((success) => {
			return removeSwitches(host).then((info) => {
				return host.destroy();
			});
		}).catch((fail) => {
			removeSwitches(host).then((info) => {
				return host.destroy();
			}).then(()=>{}).catch(()=>{});
		});
	});
}

function removeSwitches(host) {
	return host.getDvsList().then(async(result) => {
		return Promise.all(result.map((dvs) => {
			return dvs.config().then((config) => {
				let cSpec = {
					"discriminator": "VMwareDVSConfigSpec",
					"configVersion": config.configVersion,
					"host": [
						{
							"discriminator": "DistributedVirtualSwitchHostMemberConfigSpec",
							"host": {
								"discriminator": "ManagedObjectReference",
								"type": "HostSystem",
								"value": host.entity.value
							},
							"operation": "remove"
						}
					]
				};
				return dvs.reconfigure(cSpec);
			});
		}));
	});
}
