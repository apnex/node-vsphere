#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiClusterComputeResource(opts) {
	this.options =  Object.assign({}, opts);
	this.vspSession = vspSession;
	this.vspLogin = vspLogin;
}
module.exports = apiClusterComputeResource;

// session
function vspSession(hostname, username, password) {
	return vspLogin(hostname, username, password).then((service) => {
		return {
			service,
			getCluster,
			createCluster
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
function getCluster(value) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let type = 'ClusterComputeResource';
		resolve({
			service,
			entity: service.vim.ManagedObjectReference({
				value,
				type
			}),
			destroy
		});
	});
}

// ClusterComputeResource.destroy
function destroy() {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let entity = this.entity;
		service.vimPort.destroyTask(entity).then((task) => {
			console.log('Cluster[' + entity.value + '] deleted');
			resolve(task);
		});
	});
}

// ClusterComputeResource.create
function createCluster(clusterName, folderId, spec = {}) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let taskSpec = service.vim.ClusterConfigSpecEx(spec);
		let entity = service.vim.ManagedObjectReference({
			value: folderId,
			type: "Folder"
		});
		service.vimPort.createClusterEx(entity, clusterName, taskSpec).then((task) => {
			resolve(task);
		});
	});
}

