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
	if(args.length >= 2) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.nic.attach <vm.id> <vm.nic.id> <portgroup.id>'));
	}
}

// main
function main(id, deviceId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		// poll existing device config - override values in spec
		let spec = {
			"discriminator": "VirtualMachineConfigSpec",
			"deviceChange": [
				{
					"discriminator": "VirtualDeviceConfigSpec",
					"operation": "edit",
					"device": {
						"discriminator": "VirtualCdrom",
						"key": deviceId,
						"controllerKey": 15000,
						"backing": makeCdromBacking(),
					}
				}
			]
		}
		console.log(JSON.stringify(spec, null, "\t"));
		return vm.reconfigure(spec).then((vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
		}).then(()=>{}).catch(()=>{});
	});
}

function makeCdromBacking(dsPath) { // create a switch for VirtualDevice backing based on type
	return {
		"discriminator": "VirtualCdromRemoteAtapiBackingInfo",
		"deviceName": ""
	}
}
