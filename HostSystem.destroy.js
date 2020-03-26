#!/usr/bin/env node
const apiHostSystem = require('./api.HostSystem');
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
if(args[1].match(/HostSystem/g)) {
	if(args[2]) {
		run(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('HostSystem.destroy <host.id>'));
	}
}

// run
function run(hostId) {
	let core = new apiCore();
	core.vspLogin(hostname, username, password).then((service) => {
		let hosts = new apiHostSystem(service);
		hosts.getHost(hostId).then((entity) => {
			entity.destroy();
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
