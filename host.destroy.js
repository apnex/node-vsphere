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
if(args[1].match(/host/g)) {
	if(args[2]) {
		main(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('host.destroy <host.id>'));
	}
}

// main
function main(id) {
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => {
		let host = root.get(id);
		host.config().then(async(config) => {
			let switches = config.network.proxySwitch;
			return Promise.all(switches.map((dvs) => {
				return root.getDvsByUuid(dvs.dvsUuid);
			}));
		}).then((result) => {
			result.forEach((dvs) => {
				console.log(JSON.stringify(dvs.entity, null, "\t"));
			});
		});

		// host.parent //domain-c167
		// domain-c167.parent //group-h146
		// group-h146.parent // datacenter-144
		// datacenter-144.networkFolder // group-n148
		// group-n148.childEntity[] // array of portgroups and switches
		
		/*
		host.enterMaintenanceMode().then((success) => {
			return host.destroy();
		}).catch((fail) => {
			host.destroy().then(()=>{}).catch(()=>{});
		});
		*/
	});
}
