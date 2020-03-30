#!/usr/bin/env node
const apiClusterComputeResource = require('./api.ClusterComputeResource');
const apiCore = require('./api.Core');
const params = require('./params.json');
var util = require('util');

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
if(args[1].match(/ClusterComputeResource/g)) {
	if(args[2] && args[3]) {
		run(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('ClusterComputeResource.addHost <cluster.id> <host.ip>'));
	}
}

// run
function run(clusterId, hostIp) {
	let mySpec = {
		force: 1,
		hostName: hostIp,
		userName: 'root',
		password: 'VMware1!',
		port: 443
	};

	// add host to cluster
	let core = new apiCore();
	core.vspLogin(hostname, username, password).then((service) => {
		let clusters = new apiClusterComputeResource(service);
		clusters.getCluster(clusterId).then((entity) => {
			entity.addHost(mySpec).then((task) => {
				core.waitForTask(service, task).then((info) => {
					console.log(JSON.stringify(info.result, null, "\t"));
				});
			});
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
