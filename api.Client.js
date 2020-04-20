#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const apiCore = require('./entities/api.Core');
const core = new apiCore();
/*
	Client to perform 2 functions:
	- provide stateful session authentication and handling of state
	- return ManagedEntities based on MOB identifier
*/

// constructor
function apiClient() {
	this.vspLogin = vspLogin;
	this.getManagedEntity = function(id) {
		return core.getObject(this.service, id);
	}
	this.get = this.getManagedEntity;
}
module.exports = apiClient;

// login
function vspLogin(hostname, username, password) {
	return new Promise((resolve, reject) => {
		vsphere.vimService(hostname).then((service) => {
			let sessionManager = service.serviceContent.sessionManager;
			let vimPort = service.vimPort;
			vimPort.login(sessionManager, username, password).then((session) => {
				this.service = service;
				let rootFolder = require('./entities/DatacenterFolder');
				resolve(new rootFolder(service, service.serviceContent.rootFolder.value));
				//resolve(service);
			}).catch(function(err) {
				reject(err);
			});
		}).catch(function(err) {
			reject(err);
		});
	});
};
