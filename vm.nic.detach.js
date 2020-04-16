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
	if(args.length == 2) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.nic.detach <vm.id> <vnic.id>'));
	}
}

// main
function main(id, nicId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		clearBacking().then((backing) => {
			let spec = {
				"discriminator": "VirtualMachineConfigSpec",
				"deviceChange": [
					{
						"discriminator": "VirtualDeviceConfigSpec",
						"operation": "edit",
						"device": {
							"discriminator": "VirtualVmxnet3",
							"key": nicId,
							"backing": backing
						}
					}
				]
			}
			return vm.reconfigure(spec).then((vm) => {
				console.log(JSON.stringify(vm.entity, null, "\t"));
			});
		}).then(()=>{}).catch(()=>{});
	});
}

async function clearBacking() {
	return {
		"discriminator": "VirtualEthernetCardNetworkBackingInfo",
		"deviceName": ""
	}
}
