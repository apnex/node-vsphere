#!/usr/bin/env node
'use strict';
const apiClient = require('./api.Client');
const apiCore = require('./entities/api.Core');
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
if(args[1].match(/vswitch/g)) {
	main();
}

// main
function main(id) {
	let core = new apiCore();
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => {
		root.getObjects({
			type: 'DistributedVirtualSwitch',
			pathSet: ['name']
		}).then((result) => {
			if(result) {
				result.objects.forEach((item) => {
					console.log(item.obj.value + ' : ' + item.obj.type + ' : ' + item.propSet[0].val);
				});
			}
		});
	});
}
