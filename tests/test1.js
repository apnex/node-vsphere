#!/usr/bin/env node
'use strict';
const dir = '..';
const apiClient = require(dir + '/api.Client');
const params = require(dir + '/params.json');

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
if(args[1].match(/test/g)) {
	if(args[2]) {
		main(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('test1 <host.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let host = root.get(id);
		return host.enterMaintenanceMode().then((info) => {
			return host.exitMaintenanceMode();
		}).then((info) => {
			return host.enterMaintenanceMode();
		}).then((info) => {
			return host.exitMaintenanceMode();
		});
	}).then((info) => {
		console.log('end of operations');
	});
}
