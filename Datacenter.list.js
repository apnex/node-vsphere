#!/usr/bin/env node
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
	run();
}

// run
function run() {
	let core = new apiCore();
	core.vspLogin(hostname, username, password).then((service) => {
		core.getObjects(service, {
			type: 'Datacenter',
			pathSet: ['name']
		}).then((result) => {
			result.objects.forEach((item) => {
				console.log(item.obj.value + ' : ' + item.obj.type + ' : ' + item.propSet[0].val);
			});
		}).catch((err) => {
			console.log('[FAIL]... ');
			console.log(err.message);
		});
	});
}
