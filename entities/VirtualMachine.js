#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class VirtualMachine extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	powerOn() {
		return new Promise((resolve, reject) => {
			this.service.vimPort.powerOnVMTask(this.entity).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
	powerOff() {
		return new Promise((resolve, reject) => {
			this.service.vimPort.powerOffVMTask(this.entity).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
