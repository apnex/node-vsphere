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
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.cdrom.create <vm.id>'));
	}
}

// main
function main(id, mac) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		let spec = {
			"discriminator": "VirtualMachineConfigSpec",
			"deviceChange": []
		};
		spec.deviceChange.push(createCdrom());
		console.log(JSON.stringify(spec, null, "\t"));
		vm.reconfigure(spec).then((vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
		});
	});
}

function createCdrom() {
	return {
		"discriminator": "VirtualDeviceConfigSpec",
		"operation": "add",
		"device": {
			"discriminator": "VirtualCdrom",
			"key": -101,
			"controllerKey": 15000,
			"connectable": {
				"discriminator": "VirtualDeviceConnectInfo",
				"connected": true,
				"allowGuestControl": true,
				"startConnected": true,
				"status": "untried"
			},
			"backing": {
				"discriminator": "VirtualCdromRemoteAtapiBackingInfo",
				"deviceName": ""
			}
		}
	}
}

/*
deviceChange[0].device.connectable = new VcVirtualDeviceConnectInfo();
deviceChange[0].device.connectable.connected = false;
deviceChange[0].device.connectable.allowGuestControl = true;
deviceChange[0].device.connectable.startConnected = false;
deviceChange[0].device.connectable.status = 'untried';
deviceChange[0].device.backing = new VcVirtualCdromRemoteAtapiBackingInfo();deviceChange[0].device.backing.deviceName = '';

deviceChange[0].device.connectable.connected = false;
deviceChange[0].device.connectable.allowGuestControl = true;
deviceChange[0].device.connectable.startConnected = false;
deviceChange[0].device.backing = new VcVirtualCdromRemotePassthroughBackingInfo();
deviceChange[0].device.backing.exclusive = false;
deviceChange[0].device.backing.deviceName = '';
*/
