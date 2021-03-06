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
	if(args.length == 3) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('vm.nic.attach <vm.id> <vm.nic.id> <portgroup.id>'));
	}
}

// main
function main(id, nicId, pgId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then((root) => {
		let vm = root.get(id);
		let pg = root.get(pgId);
		makeBacking(pg).then((backing) => {
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

function makeBacking(network) {
	if(network.entity.type == "DistributedVirtualPortgroup") {
		return network.getDvs().then(async(dvs) => {
			return {
				"discriminator": "VirtualEthernetCardDistributedVirtualPortBackingInfo",
				"port": {
					"discriminator": "DistributedVirtualSwitchPortConnection",
					"switchUuid": await dvs.uuid(),
					"portgroupKey": network.entity.value
				}
			};
		});
	} else {
		return network.name().then((name) => {
			return {
				"discriminator": "VirtualEthernetCardNetworkBackingInfo",
				"deviceName": name,
				"network": {
						"discriminator": "ManagedObjectReference",
						"type": network.entity.type,
						"value": network.entity.value
				}
			};
		});
	}
}
