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
		console.log('[' + red('ERROR') + ']: usage ' + blue('host.network.vss.update <host.id> <vss.name> <spec>'));
	}
}

// main
function main(id, vswitchName, specName) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let host = root.get(id);
		let spec = require('./' + specName);
		host.getNetworkSystem().then((netsys) => {
			netsys.updateVirtualSwitch(vswitchName, spec).then((info) => {
				console.log('[ ' + vswitchName + ' ] updated');
			}).catch((err) => {
				console.log(JSON.stringify(err, null, "\t"));
			});
		});
	});
}
