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
		console.log('[' + red('ERROR') + ']: usage ' + blue('vswitch.addpg <vswitch.id> <portgroup.name>'));
	}
}

// main
function main(id, pgName) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vswitch = root.get(id);
		let pgSpec = require('./spec/trunk.DVPortgroupConfigSpec.json');
		//let pgSpec = require('./spec/learning.DVPortgroupConfigSpec.json');
		pgSpec.name = pgName;
		console.log(JSON.stringify(pgSpec, null, "\t"));
		vswitch.createPortgroup(pgSpec).then((pg) => {
			console.log('finished...');
		});
	});
}
