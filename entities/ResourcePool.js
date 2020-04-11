#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ResourcePool extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	owner() {
		return new Promise((resolve, reject) => {
			this.getProperty('owner').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	createResourcePool(name, rSpec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let resSpec = super.buildSpec('ResourceConfigSpec', rSpec);
			service.vimPort.createResourcePool(entity, name, resSpec).then((entity) => {
				resolve(super.getObject(entity.value));
			});
		});
	}
	createVApp(name, rSpec, cSpec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;

			// traverse mob tree and find 'group-v' folder
			this.owner().then((cluster) => {
				return cluster.parent();
			}).then((hosts) => {
				return hosts.parent();
			}).then((dc) => {
				return dc.vmFolder();
			}).then((vmFolder) => {
				let resSpec = super.buildSpec('ResourceConfigSpec', rSpec);
				let configSpec = super.buildSpec('VAppConfigSpec', cSpec);
				service.vimPort.createVApp(entity, name, resSpec, configSpec, vmFolder.entity).then((entity) => {
					resolve(super.getObject(entity.value));
				});
			});
		});
	}
	createChildVM(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.createChildVMTask(entity, super.buildSpec('VirtualMachineConfigSpec', spec)).then((task) => {
				super.waitForTask(task).then((info) => {
					resolve(super.getObject(info.result.value));
				});
			});
		});
	}
};
