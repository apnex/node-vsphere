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
		/*TEST
		let ds = root.get('datastore-230');
		ds.makeDirectory('/mottu/blublu').then((path) => {
			console.log('Completed: ' + path);
		});
		TEST*/

		let vm = root.get(id);
		vm.getHost().then((host) => {
			console.log(JSON.stringify(host.entity, null, "\t"));
			host.getNetworkList().then((list) => {
				return Promise.all(list.map(async(item) => {
					let dvs = "";
					if(item.entity.type == "DistributedVirtualPortgroup") {
						dvs = (await item.config()).distributedVirtualSwitch.value;
					}
					return {
						"name": await item.name(),
						"type": item.entity.type,
						"value": item.entity.value,
						"switch": dvs
					};
				}));
			}).then((list) => {
				console.log('[Available Networks]');
				list.sort((a, b) => {
					return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
				}).forEach((item) => {
					console.log(item.value.padEnd(18, ' ') + item.type.padEnd(30, ' ') + item.name.padEnd(25, ' ') + item.switch);
				});
			});
			host.getDatastoreList().then((list) => {
				return Promise.all(list.map(async(item) => {
					return {
						"name": await item.name(),
						"type": item.entity.type,
						"value": item.entity.value
					};
				}));
			}).then((list) => {
				console.log('[Available Datastores]');
				list.sort((a, b) => {
					return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
				}).forEach((item) => {
					console.log(item.value.padEnd(18, ' ') + item.type.padEnd(30, ' ') + item.name.padEnd(25, ' '));
				});
			});
		});
	});
}
