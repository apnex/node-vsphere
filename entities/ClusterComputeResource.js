#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ClusterComputeResource extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	resourcePool() {
		return new Promise((resolve, reject) => {
			super.getObjects({
				type: 'ClusterComputeResource',
				pathSet: ['resourcePool']
			}).then((result) => {
				let myCluster = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				let poolId = myCluster.propSet[0].val.value;
				let myPool = super.getEntity(poolId);
				resolve(myPool);
			});
		});
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
			this.resourcePool().then((pool) => {
				resolve(pool.createResourcePool(poolName));
			});
		});
	}
	createVApp(vappName, spec = {}) {
		return new Promise((resolve, reject) => {
			this.resourcePool().then((pool) => {
				resolve(pool.createVApp(vappName));
			});
		});
	}
};
