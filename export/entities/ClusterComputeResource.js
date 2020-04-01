#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ClusterComputeResource extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	sayHello() {
		console.log('I have ID: ' + this.entity);
	}
	addHost(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cluster = this.entity;
			let mySpec = service.vim.HostConnectSpec(spec)
			service.vimPort.addHostTask(cluster, mySpec, 1).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
