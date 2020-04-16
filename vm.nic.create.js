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
	if(args.length >= 1) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.nic.add <vm.id> [ <mac.address> ]'));
	}
}

// main
function main(id, mac) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		let macAddress = "";
		let addressType = "generated";
		if(typeof(mac) !== 'undefined') {
			macAddress = mac;
			addressType = "manual";
		}
		let spec = {
			"discriminator": "VirtualMachineConfigSpec",
			"deviceChange": [
				{
					"discriminator": "VirtualDeviceConfigSpec",
					"operation": "add",
					"device": {
						"discriminator": "VirtualVmxnet3",
						"key": -101,
						"macAddress": macAddress,
						"addressType": addressType,
						"connectable": {
							"discriminator": "VirtualDeviceConnectInfo",
							"connected": true,
							"allowGuestControl": true,
							"startConnected": true
						},
						"backing": {
							"discriminator": "VirtualEthernetCardNetworkBackingInfo",
							"deviceName": ""
						}
					}
				}
			]
		}
		vm.reconfigure(spec).then((vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
		});
	});
}
