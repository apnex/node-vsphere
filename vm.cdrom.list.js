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
	if(args.length == 1) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.hardware.list <vm.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		vm.getHardware().then((hardware) => {
			let nics = hardware.device.filter((item) => {
				return (item.macAddress); // is a vnic
			});
			nics.forEach((nic) => {
				console.log('key: ' + nic.key + ' label: ' + nic.deviceInfo.label + ' unitNumber: ' + nic.unitNumber + ' macAddress: ' + nic.macAddress);
			});
		});
	});
}
