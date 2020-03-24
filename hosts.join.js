#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');
var util = require('util');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

// run
run();
function run() {
	let mySpec = {
		force: 1,
		hostName: '172.16.10.30',
		userName: 'root',
		password: 'VMware1!',
		port: 443
	};

	// add host to cluster
	vspSession(hostname, username, password).then((client) => {
		client.getFolder('domain-c13').then((cluster) => {
			cluster.addHost(mySpec).then((response) => {
				console.log('addHost Success!!!');
			});
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}

// session
function vspSession(hostname, username, password) {
	return vspLogin(hostname, username, password).then((service) => {
		return {
			service,
			getFolder
		};
	});
}

// client.getFolder
function getFolder(folderId) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		resolve({
			service,
			entity: service.vim.ManagedObjectReference({
				value: folderId,
				type: 'ClusterComputeResource'
			}),
			addHost
		});
	});
}

// ClusterConputeResource.addHost
function addHost(spec) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let cluster = this.entity;
		console.log('addHost!!... ');
		console.log(cluster);
		let mySpec = service.vim.HostConnectSpec(spec)
		service.vimPort.addHostTask(cluster, mySpec, 1).then((task) => {
			console.log('addHost Task in function!!');
			console.log(task);
			resolve(task);
		});
	});
}

// login
function vspLogin(hostname, username, password) {
	return new Promise((resolve, reject) => {
		vsphere.vimService(hostname).then((service) => {
			let sessionManager = service.serviceContent.sessionManager;
			let vimPort = service.vimPort;
			vimPort.login(sessionManager, username, password).then(() => {
				resolve(service);
			}).catch(function(err) {
				reject(err);
			});
		}).catch(function(err) {
			reject(err);
		});
	});
};

function checkThumbprint(service, datacenter, spec) {
	return new Promise((resolve, reject) => {
		service.vimPort.queryConnectionInfoViaSpec(datacenter, spec, 1).then((result) => {
			console.log(JSON.stringify(result, null, "\t"));
			resolve(result)
		}).catch((err) => {
			console.log(err);
			if(err.info.thumbprint) {
				console.log('YAY Thumbprint: [' + err.info.thumbprint + ']');
				resolve(err.info.thumbprint);
			} else {
				reject(err);
			};
		});
	});
}
