#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class VirtualMachine extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('config'));
		});
	}
	runtime() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('runtime'));
		});
	}
	getHardware() {
		return new Promise((resolve, reject) => {
			this.config().then((config) => {
				resolve(config.hardware);
			});
		});
	}
	getHost() {
		return new Promise((resolve, reject) => {
			this.runtime().then((state) => {
				resolve(this.getObject(state.host.value));
			});
		});
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
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cSpec = super.buildSpec('VirtualMachineConfigSpec', spec);
			service.vimPort.reconfigVMTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
