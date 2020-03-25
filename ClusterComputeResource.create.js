#!/usr/bin/env node
const ClusterComputeResourceApi = require('./ClusterComputeResourceApi');
const CoreApi = require('./CoreApi');
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
	if(args[2] && args[3]) {
		run(args[2], args[3]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('ClusterComputeResource.create <datacenter.id> <cluster.name>'));
	}
}

// run
function run(datacenterId, clusterName) {
	let ccra = new ClusterComputeResourceApi();
	let capi = new CoreApi();
	ccra.vspSession(hostname, username, password).then((client) => {
		capi.getObjects(client.service, {
			type: 'Datacenter',
			pathSet: ['hostFolder']
		}).then((result) => {
			let myDc = result.objects.filter((item) => {
				return (item.obj.value == datacenterId);
			})[0];
			let hostFolder = myDc.propSet[0].val.value;
			client.createCluster(clusterName, hostFolder).then((task) => {
				console.log('Create Finale Success!!!');
			});
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}
