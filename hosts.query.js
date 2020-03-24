#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

vsphere.vimService(hostname).then((service) => {
	let propertyCollector = service.serviceContent.propertyCollector;
	let rootFolder = service.serviceContent.rootFolder;
        let sessionManager = service.serviceContent.sessionManager;
        let viewManager = service.serviceContent.viewManager;
        let vim = service.vim;
        let vimPort = service.vimPort;

	let mySpec = vim.HostConnectSpec({
		force: 1,
		hostName: '172.16.10.30',
		userName: 'root',
		password: 'VMware1!',
		port: 443
	});
	let myFolder = vim.ManagedObjectReference({
		value: 'domain-c13',
		type: 'ClusterComputeResource'
	});
	let myDatacenter = vim.ManagedObjectReference({
		value: 'datacenter-3',
		type: 'Datacenter'
	});
	//myDatacenter.queryConnectionInfoViaSpec();

	return vimPort.login(sessionManager, username, password).then(() => {
		vimPort.queryConnectionInfoViaSpec(myDatacenter, mySpec, 1).then((result) => {
			hostJoin(vimPort, myFolder, mySpec);
		}).catch((err) => {
			console.log(err);
			if(err.info.thumbprint) {
				console.log('YAY Thumbprint: [' + err.info.thumbprint + ']');
				let newSpec = vim.HostConnectSpec({
					force: 1,
					hostName: '172.16.10.30',
					userName: 'root',
					password: 'VMware1!',
					sslThumbprint: err.info.thumbprint
				});
				hostJoin(vimPort, myFolder, newSpec);
			}
		});
	}).then((result) => {
		//console.log(result);
	});
}).catch(function(err) {
	console.log('MOOOO: ' + err.message);
});

function hostJoin(vimPort, myFolder, mySpec) {
	console.log('Thumbprint valid... adding host');
	vimPort.addHostTask(myFolder, mySpec, 1).catch((err) => {
		console.log(err);
	});
}
