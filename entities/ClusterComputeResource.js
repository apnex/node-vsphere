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
	createResourcePool(poolName, spec = {}) {
		return new Promise((resolve, reject) => {
			super.getObjects({
				type: 'ClusterComputeResource',
				pathSet: ['resourcePool']
			}).then((result) => {
				let service = this.service;
				let myCluster = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				let poolId = myCluster.propSet[0].val.value;
				console.log('My Parent Pool ID[' + poolId + ']');
				let rootPool = super.getEntity(poolId);
				rootPool.createResourcePool(poolName).then((info) => {
					console.log('mid success');
					resolve(info);
				});
			});
		});
	}
};
