#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
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
if(args[1].match(/HostSystem/g)) {
	if(args[2]) {
		run(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('HostSystem.destroy <host.id>'));
	}
}

// run
function run(hostId) {
	// destroy host
	vspSession(hostname, username, password).then((client) => {
		client.deleteHost(hostId).then((task) => {
			console.log('removeHost Success!!!');
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
			deleteHost,
			getHostSystem
		};
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

// client.getHostSystem
function getHostSystem(value) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let type = 'HostSystem';
		resolve({
			service,
			entity: service.vim.ManagedObjectReference({
				value,
				type
			})
		});
	});
}

// ClusterComputeResource.deleteHost
function deleteHost(hostId) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let cluster = this.entity;
		this.getHostSystem(hostId).then((host) => {
			console.log(host.entity);
			service.vimPort.destroyTask(host.entity).then((task) => {
				console.log('Host[' + hostId + '] deleted');
				resolve(task);
			});
		});
	});
}

// ClusterComputeResource.addHost
function addHost(spec) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let cluster = this.entity;
		let mySpec = service.vim.HostConnectSpec(spec)
		service.vimPort.addHostTask(cluster, mySpec, 1).then((task) => {
			console.log('addHost Task in function!!');
			console.log(task);
			resolve(task);
		});
	});
}
