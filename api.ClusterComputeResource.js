#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiClusterComputeResource(service) {
	this.service = service;
	this.getEntity = getEntity;
	this.getCluster = function(value) {
		return this.getEntity({value, type: 'ClusterComputeResource'});
	};
	this.createCluster = createCluster;
}
module.exports = apiClusterComputeResource;

// client.getEntity
function getEntity(spec) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		resolve({
			service,
			entity: service.vim.ManagedObjectReference(spec),
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
			console.log('Entity[' + entity.value + '] deleted');
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