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
	// destroy host
	vspSession(hostname, username, password).then((client) => {
		client.deleteHost('host-44').then((task) => {
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

// ClusterConputeResource.addHost
function deleteHost(hostId) {
	return new Promise((resolve, reject) => {
		console.log('deleteHost[ ' + hostId + ' ] !!!!');
		let service = this.service;
		let cluster = this.entity;
		//let hsm = service.serviceContent.hostSpecManager;
		// get HostSystem
		this.getHostSystem(hostId).then((host) => {
			console.log(host.entity);
			//console.log(hsm);
			//service.vimPort.deleteHostSpecification(hsm, host.entity).then((task) => {
			service.vimPort.destroyTask(host.entity).then((task) => {
				console.log('Host deleted');
				resolve(task);
			});
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
