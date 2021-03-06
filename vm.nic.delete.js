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
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.nic.remove <vm.id> <device.id>'));
	}
}

// main
function main(id, deviceId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		let spec = {
			"discriminator": "VirtualMachineConfigSpec",
			"deviceChange": [
				{
					"discriminator": "VirtualDeviceConfigSpec",
					"operation": "remove",
					"device": {
						"discriminator": "VirtualVmxnet3",
						"key": deviceId
					}
				}
			]
		}

		vm.reconfigure(spec).then((vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
			//vm.powerOn().then((info) => {
			//});
		});
		/*makeBacking(portgroup).then((backing) => {
			spec.deviceChange.push({
				"discriminator": "VirtualDeviceConfigSpec",
				"operation": "add",
				"device": backing
			});
			console.log(JSON.stringify(spec, null, "\t"));
			return entity.createChildVM(spec);
		}).then((vm) => {
			//vm.powerOn().then((info) => {
			//	console.log(JSON.stringify(info, null, "\t"));
			//});
		});*/
	});
}

function makeBacking(portgroup) {
	return portgroup.getDvs().then(async(dvs) => {
		return {
			"discriminator": "VirtualEthernetCardDistributedVirtualPortBackingInfo",
			"port": {
				"discriminator": "DistributedVirtualSwitchPortConnection",
				"switchUuid": await dvs.uuid(),
				"portgroupKey": portgroup.entity.value
			}
		};
	});
}
