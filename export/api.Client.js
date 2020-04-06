#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const apiCore = require('./entities/api.Core');
const ClusterComputeResource = require('./entities/ClusterComputeResource');
const HostSystem = require('./entities/HostSystem');
const Datacenter = require('./entities/Datacenter');
const ResourcePool = require('./entities/ResourcePool');
const core = new apiCore();
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
	let type = [
		'Datacenter',
		'ClusterComputeResource',
		'HostSystem',
		'ResourcePool'
	].filter((item) => {
		return item == core.getEntityType(id);
	})[0];
	if(typeof(type) !== 'undefined') {
		const entityClass = require('./entities/' + type);
		return(new entityClass(this.service, id));
	}
}
