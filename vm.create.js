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
if(args[1].match(/vm/g)) {
	if(args[2] && args[3]) {
		main(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.create <resource-pool.id> <vm.name>'));
	}
}

// main
function main(id, vmName) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let entity = root.get(id);
		var spec = require('./spec/blank.VirtualMachineConfigSpec.json');
		spec.name = vmName;
		entity.createChildVM(spec).then((vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
		});
	});
}
