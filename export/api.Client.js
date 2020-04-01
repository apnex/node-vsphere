#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const ClusterComputeResource = require('./entities/ClusterComputeResource');
const HostSystem = require('./entities/HostSystem');
const Datacenter = require('./entities/Datacenter');
/*
	Client to perform 2 functions:
	- provide stateful session authentication and handling of state
	- return ManagedEntities based on MOB identifier
*/

// constructor
function apiClient() {
	this.vspLogin = vspLogin;
	this.getManagedEntity = getManagedEntity;
	this.get = getManagedEntity;
}
module.exports = apiClient;

// login
function vspLogin(hostname, username, password) {
	return new Promise((resolve, reject) => {
		vsphere.vimService(hostname).then((service) => {
			let sessionManager = service.serviceContent.sessionManager;
			let vimPort = service.vimPort;
			vimPort.login(sessionManager, username, password).then(() => {
				this.service = service;
				resolve(service);
			}).catch(function(err) {
				reject(err);
			});
		}).catch(function(err) {
			reject(err);
		});
	});
};

function getManagedEntity(id) {
	switch(true) {
		case /^datacenter-/.test(id):
			return(new Datacenter(this.service, id));
		break;
		case /^domain-c/.test(id):
			return(new ClusterComputeResource(this.service, id));
		break;
		case /^host-/.test(id):
			return(new HostSystem(this.service, id));
		break;
		case /^vm-/.test(id):
			console.log(id + ' is a VirtualMachine');
		break;
		case /^group-/.test(id):
			console.log(id + ' is a Folder');
		break;
		default:
			console.log(id + ' is no idea?');
		break;
	}
}
