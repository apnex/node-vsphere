#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class HostSystem extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	sayHello() {
		console.log('I have ID: ' + this.entity);
	}
	exitMaintenanceMode(taskSpec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.exitMaintenanceModeTask(entity, taskSpec.timeout).then((task) => {
				// return a promise for waitForTask
				resolve(super.waitForTask(task));
				//resolve(task);
			});
		});
	}
	enterMaintenanceMode(taskSpec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.enterMaintenanceModeTask(entity, taskSpec.timeout).then((task) => {
				//return super.waitForTask(task);
				resolve(super.waitForTask(task));
			});
		});
	}
};
