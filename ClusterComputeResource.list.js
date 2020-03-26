#!/usr/bin/env node
const apiClusterComputeResource = require('./api.ClusterComputeResource');
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
if(args[1].match(/ClusterComputeResource/g)) {
	/*if(args[2] && args[3]) {
		run(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('ClusterComputeResource.create <datacenter.id> <cluster.name>'));
	}*/
	run();
}

// run
function run() {
	let ccra = new apiClusterComputeResource(); // add auth into constructor?
	let capi = new apiCore();
	ccra.vspSession(hostname, username, password).then((client) => {
		capi.getObjects(client.service, {
			type: 'ClusterComputeResource',
			pathSet: ['name']
		}).then((result) => {
			result.objects.forEach((item) => {
				console.log(item.obj.value + ' : ' + item.obj.type + ' : ' + item.propSet[0].val);
			});
			console.log('Create Finale Success!!!');
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
