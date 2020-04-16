#!/usr/bin/env node
'use strict';
const ComputeResource = require('./ComputeResource');

module.exports = class ClusterComputeResource extends ComputeResource {
	constructor(service, id) {
		super(service, id);
	}
	resourcePool() {
		return new Promise((resolve, reject) => {
			this.getProperty('resourcePool').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	addHost(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cluster = this.entity;
			let mySpec = service.vim.HostConnectSpec(spec)
			service.vimPort.addHostTask(cluster, mySpec, 1).then((task) => {
				super.waitForTask(task).then((info) => {
					resolve(super.getObject(info.result.value));
				}).catch((info) => { // check for SSL error and retry
					if(info.error) {
						if(info.error.fault.thumbprint) {
							spec['sslThumbprint'] = info.error.fault.thumbprint;
							resolve(this.addHost(spec));
						}
					}
				});
			});
		});
	}
	createResourcePool(poolName, rSpec) {
		return new Promise((resolve, reject) => {
			this.resourcePool().then((pool) => {
				resolve(pool.createResourcePool(poolName, rSpec));
			});
		});
	}
	createVApp(vappName, rSpec, cSpec) {
		return new Promise((resolve, reject) => {
			this.resourcePool().then((pool) => {
				resolve(pool.createVApp(vappName, rSpec, cSpec));
			});
		});
	}
};
