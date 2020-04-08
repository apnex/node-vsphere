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
	exitMaintenanceMode({timeout = 60} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.exitMaintenanceModeTask(entity, timeout).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
	enterMaintenanceMode({timeout = 60} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.enterMaintenanceModeTask(entity, timeout).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};