#!/usr/bin/env node
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

// Linking
var defs = {
	VirtualMachineConfigSpec: {
		files: 'VirtualMachineFileInfo',
		deviceChange: 'VirtualDeviceConfigSpec'
	},
	VirtualDeviceConfigSpec: {
		device: 'VirtualDisk'
	},
	ParaVirtualSCSIController: {
		deviceInfo: 'Description'
	},
	VirtualDisk: {
		backing: 'VirtualDiskFlatVer2BackingInfo',
		deviceInfo: 'Description'
	}
}

// called from shell
let client = new apiClient(); // add auth?
client.vspLogin(hostname, username, password).then((root) => {
	var spec = require('./router.cdrom.json');
	var vmSpec = main(root.service, 'VirtualMachineConfigSpec', spec);
	console.log(JSON.stringify(vmSpec, null, "\t"));
	var entity = root.get('resgroup-v2023');
	entity.createChildVM(vmSpec).then((info) => {
		console.log('end of operations');
	});
});

function main(service, type, spec) {
	console.log(JSON.stringify(spec));
	let result = isSpec(service, type, spec);
	return result;
}

function isSpec(service, type, spec) {
	let body = {};
	if(typeof(spec.discriminator) !== 'undefined') { // override
		type = spec.discriminator;
	}
	Object.entries(spec).forEach((item) => {
		if(item[0] != 'discriminator') {
			if(typeof(item[1]) === 'object') {
				let child = type.toString();
				if(typeof(defs[type]) !== 'undefined' && typeof(defs[type][item[0]]) !== 'undefined') {
					child = defs[type][item[0]];
				}
				if(Array.isArray(item[1])) { // Array
					body[item[0]] = [];
					item[1].forEach((value) => { // forEach item in array
						body[item[0]].push(isSpec(service, child, value));
					});
				} else { // Object
					body[item[0]] = isSpec(service, child, item[1]);
				}
			} else {
				body[item[0]] = item[1];
			}
		}
	});
	//console.log('TYPE[' + type + ']');
	//console.log(JSON.stringify(service.vim[type](body), null, "\t"));
	return service.vim[type](body);
}
