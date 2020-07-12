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
if(process.argv[1].match(/esx/g)) {
	if(args.length >= 4) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('esx.create <node.id> <resource-pool.id> <datastore.id> <portgroup.id>'));
	}
}

// main
function main(node, resId, dsId, pgId) {
	let client = new apiClient();
	client.vspLogin(hostname, username, password).then(async(root) => {
		// upload iso
		let ds = root.get(dsId);
		let srcFile = './esx.local.iso';
		let dsFile = '/iso/esx.local.iso';
		let dsName = await ds.name();
		ds.uploadFile(srcFile, dsFile).then((path) => {
			// create vm
			//let spec = require('./spec/esx.nest.json');
			let spec = require('./spec/esx.vsan.nest.json');
			spec.name = 'esx' + node;
			spec.guestId = 'vmkernel7Guest';
			spec.memoryMB = 32768;
			spec.files.vmPathName = "[" + dsName + "]";
			spec.deviceChange[1].device.backing.fileName = "[" + dsName + "]";
			spec.deviceChange[2].device.backing.fileName = "[" + dsName + "]";
			spec.deviceChange[3].device.backing.fileName = "[" + dsName + "]";
			//console.log(JSON.stringify(spec, null, "\t"));
			let resource = root.get(resId);
			return resource.createChildVM(spec);
		}).then(async(vm) => {
			console.log(JSON.stringify(vm.entity, null, "\t"));
			let pg = root.get(pgId);

			// configure nic and cdrom
			let mac1 = '00:de:ad:be:' + node + ':01';
			let mac2 = '00:de:ad:be:' + node + ':02';
			await createNic(vm, mac1);
			await attachNic(vm, 4000, pg);
			await createNic(vm, mac2);
			await attachNic(vm, 4001, pg);
			// getVirtualNic list?

			let cdroms = await createCdrom(vm); // return CDROM list!
			// if wrong key - causes physical esx host to disconnect from VC
			await attachCdrom(vm, cdroms[0].key, dsName, dsFile);
			await vm.powerOn();
			console.log('vm powered on');
		});
	});
}

async function createCdrom(vm) {
	let spec = {
		"discriminator": "VirtualMachineConfigSpec",
		"deviceChange": []
	};
	let cdSpec = createCdromSpec();
	spec.deviceChange.push(cdSpec);
	return vm.reconfigure(spec).then((item) => {
		return vm.getHardware().then((hardware) => {
       			return hardware.device.filter((device) => {
				return (device.discriminator == 'VirtualCdrom');
			});
		});
	});
}

function attachCdrom(vm, cdKey, dsName, dsFile) {
	let spec = {
		"discriminator": "VirtualMachineConfigSpec",
		"deviceChange": []
	};
	let cdSpec = createCdromSpec();
	cdSpec.device.key = cdKey;
	cdSpec.device.backing = makeCdromBacking(dsName, dsFile);
	cdSpec.operation = 'edit';
	spec.deviceChange.push(cdSpec);
	return vm.reconfigure(spec);
}

function createCdromSpec() {
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

function makeCdromBacking(dsName, dsPath) { // create a switch for VirtualDevice backing based on type
	let filePath = '[' + dsName + '] ' + dsPath;
	return {
		"discriminator": "VirtualCdromIsoBackingInfo",
		"fileName": filePath
	}
}

function createNic(vm, mac) {
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
	return vm.reconfigure(spec);
	// return the NIC Hardware ID!
}

function attachNic(vm, nicId, pg) {
	return makeBacking(pg).then(async(backing) => {
		let hardware = await vm.getHardware();
		let device = hardware.device.filter((device) => {
			return (nicId == device.key);
		})[0];
		let spec = {
			"discriminator": "VirtualMachineConfigSpec",
			"deviceChange": [
				{
					"discriminator": "VirtualDeviceConfigSpec",
					"operation": "edit",
					"device": {
						"discriminator": "VirtualVmxnet3",
						"key": nicId,
						"addressType": device.addressType,
						"macAddress": device.macAddress,
						"backing": backing
					}
				}
			]
		}
		//console.log(JSON.stringify(spec, null, "\t"));
		return vm.reconfigure(spec);
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
