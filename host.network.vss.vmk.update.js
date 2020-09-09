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
const args = process.argv.splice(2);
if(process.argv[1].match(/vm/g)) {
	if(args.length >= 3) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('host.network.vss.vmk.update <host.id> <vmk.name> <portgroup.name>'));
	}
}

// main
function main(id, vmkName, pgName) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let host = root.get(id);
		// add logic? if dest pg does not exist, create it
		let spec = {
			"discriminator": "HostVirtualNicSpec",
			"portgroup": pgName
		};
		host.getNetworkSystem().then((netsys) => {
			netsys.updateVirtualNic(vmkName, spec).then((info) => {
				console.log('[ ' + vmkName + ' ] mapped to [ ' + spec.portgroup + ' ]');
			}).catch((err) => {
				console.log(JSON.stringify(err, null, "\t"));
			});
		});
	});
}
