#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class HostSystem extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('config'));
		});
	}
	network() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('network'));
		});
	}
	getNetworkList() {
		return this.network().then(async(networks) => {
			return Promise.all(networks.map((net) => {
				return this.getObject(net.value);
			}));
		});
	}
	getDvsList() {
		return this.config().then(async(config) => {
			let switches = config.network.proxySwitch;
			return Promise.all(switches.map((dvs) => {
				return this.getDvsByUuid(dvs.dvsUuid);
			}));
		});
	}
	exitMaintenanceMode({timeout = 60} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.exitMaintenanceModeTask(entity, timeout).then((task) => {
				resolve(this.waitForTask(task));
			});
		});
	}
	enterMaintenanceMode({timeout = 60} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.enterMaintenanceModeTask(entity, timeout).then((task) => {
				resolve(this.waitForTask(task));
			});
		});
	}
};
