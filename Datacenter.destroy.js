#!/usr/bin/env node
const apiDatacenter = require('./api.Datacenter');
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
		console.log('[' + red('ERROR') + ']: usage ' + blue('Datacenter.destroy <datacenter.id>'));
	}
}

// run
function run(datacenterId) {
	let ccra = new apiDatacenter();
	ccra.vspSession(hostname, username, password).then((client) => {
		client.getDatacenter(datacenterId).then((entity) => {
			entity.destroy();
			console.log('Finale Success!!!');
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
