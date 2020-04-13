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
	if(args[2]) {
		main(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.create <resource-pool.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let entity = root.get(id);
		var spec = require('./spec/base.VirtualMachineConfigSpec.json');
		var nic = require('./spec/spec.VirtualVmxnet3.json');
		nic.backing = {
			"discriminator": "VirtualEthernetCardDistributedVirtualPortBackingInfo",
			"port": {
				"discriminator": "DistributedVirtualSwitchPortConnection",
				"switchUuid": "50 24 5b 7d 67 65 6a 4f-35 79 02 31 a5 34 42 ff",
				"portgroupKey": "dvportgroup-180"
			}
		};
		spec.deviceChange.push({
			"discriminator": "VirtualDeviceConfigSpec",
			"operation": "add",
			"device": nic
		});
		console.log(JSON.stringify(spec, null, "\t"));
		entity.createChildVM(spec).then((vm) => {
			//vm.powerOn().then((info) => {
			//	console.log(JSON.stringify(info, null, "\t"));
			//});
		})
	});
}
