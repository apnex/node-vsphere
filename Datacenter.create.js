#!/usr/bin/env node
const apiDatacenter = require('./api.Datacenter');
const apiCore = require('./api.Core');
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
if(args[1].match(/Datacenter/g)) {
	if(args[2]) {
		run(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('Datacenter.create <datacenter.name>'));
	}
}

// run
function run(datacenterName) {
	let ccra = new apiDatacenter();
	let capi = new apiCore();
	ccra.vspSession(hostname, username, password).then((client) => {
		client.createDatacenter(datacenterName).then((task) => {
			console.log('Create Finale Success!!!');
		});
	}).catch((err) => {
		console.log('FAIL... ');
	});
}
