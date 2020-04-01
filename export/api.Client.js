#!/usr/bin/env node
const vsphere = require('../dist/vsphere');
const HostSystem = require('./HostSystem');
const ClusterComputeResource = require('./ClusterComputeResource');
// Core to have knowledge of all Managed Entity sub-types, so that they can be returned as method-bound objects

// constructor
function apiClient(opts) {
	this.options =  Object.assign({}, opts);
	this.vspLogin = vspLogin;
	this.getManagedEntity = getManagedEntity;
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
		case /^domain-c/.test(id):
			return(new ClusterComputeResource(this.service, id));
		break;
		case /^vm-/.test(id):
			console.log(id + ' is a VirtualMachine');
		break;
		case /^host-/.test(id):
			return(new HostSystem(this.service, id));
		break;
		case /^group-/.test(id):
			console.log(id + ' is a Folder');
		break;
		case /^datacenter-/.test(id):
			return(new Datacenter(this.service, id));
		break;
		default:
			console.log(id + ' is no idea?');
		break;
	}
}
