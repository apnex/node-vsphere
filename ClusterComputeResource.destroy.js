#!/usr/bin/env node
const ClusterComputeResourceApi = require('./ClusterComputeResourceApi');
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
if(args[1].match(/ClusterComputeResource/g)) {
	if(args[2]) {
		run(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('ClusterComputeResource.destroy <cluster.id>'));
	}
}

// run
function run(clusterId) {
	let ccra = new ClusterComputeResourceApi(); // add auth into constructor?
	ccra.vspSession(hostname, username, password).then((client) => {
		client.getCluster(clusterId).then((cluster) => {
			cluster.destroy();
			console.log('Finale Success!!!');
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
