#!/usr/bin/env node
'use strict';
const dir = '..';
const apiClient = require(dir + '/api.Client');
const params = require(dir + '/params.json');

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
if(args[1].match(/test/g)) {
	if(args[2] && args[3]) {
		main(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('join.create <datacenter.id> <cluster.name>'));
	}
}

// main
function main(id, name) {
	let client = new apiClient(); // add auth?
	client.vspLogin(hostname, username, password).then((root) => {
		let dc = root.get(id);
		let cSpec = require(dir + '/spec/spec.ClusterConfigSpecEx.json');
		dc.createCluster(name, cSpec).then((cluster) => {
			return cluster.addHost({
				force: 1,
				hostName: '172.16.10.30',
				userName: 'root',
				password: 'VMware1!',
				port: 443
			}).then((host) => {
				return host.exitMaintenanceMode().then((info) => {
					return host.enterMaintenanceMode();
				}).then((info) => {
					return host.destroy();
				});
			}).then((info) => {
				return cluster.destroy();
			});
		}).then((info) => {
			console.log('end of operations');
		});
	});
}
