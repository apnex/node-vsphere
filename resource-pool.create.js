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
if(args[1].match(/resource-pool/g)) {
	if(args[2] && args[3]) {
		main(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('resource-pool.create <cluster.id> <pool.name>'));
	}
}

// main
function main(id, name) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((service) => {
		let spec = {
			cpuAllocation: {},
			memoryAllocation: {}
		};
		let cluster = client.getManagedEntity(id);
		cluster.createResourcePool(name).then((info) => {
			console.log('end of operations');
		});
	});
}
