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
if(process.argv[1].match(/datastore/g)) {
	if(args.length >= 1) {
		main(...args);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('datastore.destroy <datastore.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => {
		let item = root.get(id);
		//console.log(JSON.stringify(item, null, "\t"));
		return item.destroy();
	});
}
