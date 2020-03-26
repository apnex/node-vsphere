#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiHostSystem(service) {
	this.service = service;
	this.getEntity = getEntity;
	this.getHost = function(value) {
		return this.getEntity({value, type: 'HostSystem'});
	};
	//this.createHost = createHost;
}
module.exports = apiHostSystem;

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

// entity.destroy
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

// Datacenter.create
/*
function createHost(datacenterName) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let rootFolder = service.serviceContent.rootFolder;
		service.vimPort.createDatacenter(rootFolder, datacenterName).then((task) => {
			resolve(task);
		});
	});
}
*/
