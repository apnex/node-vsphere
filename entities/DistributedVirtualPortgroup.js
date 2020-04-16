#!/usr/bin/env node
'use strict';
const Network = require('./Network');

module.exports = class DistributedVirtualPortgroup extends Network {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('config'));
		});
	}
	getDvs() {
		return new Promise((resolve, reject) => {
			this.config().then((config) => {
				resolve(this.getObject(config.distributedVirtualSwitch.value));
			});
		});
	}
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cSpec = super.buildSpec('DVPortgroupConfigSpec', spec);
			service.vimPort.reconfigureDVPortgroupTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
