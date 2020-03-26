#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiDatacenter(opts) { //returns a datacenter factory
	this.options =  Object.assign({}, opts);
	this.vspSession = vspSession;
	this.vspLogin = vspLogin;
}
module.exports = apiDatacenter;

// session
function vspSession(hostname, username, password) {
	return vspLogin(hostname, username, password).then((service) => {
		return {
			service,
			getEntity,
			getDatacenter: function(value) {
				return this.getEntity(value, 'Datacenter');
			},
			createDatacenter
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

// client.getEntity
function getEntity(value, type) {
	return new Promise((resolve, reject) => {
		let service = this.service;
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
