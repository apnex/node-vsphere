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
if(args[1].match(/datacenter/g)) {
	if(args[2]) {
		main(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('datacenter.create <datacenter.name>'));
	}
}

// main
function main(name) {
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => { // return rootFolder?
		//console.log(root);
		//let dc = client.get(id);
		root.createDatacenter(name).then((info) => {
			console.log(JSON.stringify(info, null, "\t"));
		});
	});
}
