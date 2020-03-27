#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiDatacenter(service) {
	this.service = service;
	this.getEntity = getEntity;
	this.getDatacenter = function(value) {
		return this.getEntity({value, type: 'Datacenter'});
	};
	this.createDatacenter = createDatacenter;
}
module.exports = apiDatacenter;

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
function createDatacenter(datacenterName) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let rootFolder = service.serviceContent.rootFolder;
		service.vimPort.createDatacenter(rootFolder, datacenterName).then((task) => {
			resolve(task);
		});
	});
}
