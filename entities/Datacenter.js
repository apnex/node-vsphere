#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Datacenter extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	hostFolder() {
		return new Promise((resolve, reject) => {
			this.getProperty('hostFolder').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	networkFolder() {
		return new Promise((resolve, reject) => {
			this.getProperty('networkFolder').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	vmFolder() {
		return new Promise((resolve, reject) => {
			this.getProperty('vmFolder').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	createCluster(name, spec) {
		return new Promise((resolve, reject) => {
			this.hostFolder().then((folder) => {
				let service = this.service;
				let cSpec = super.buildSpec('ClusterConfigSpecEx', spec);
				service.vimPort.createClusterEx(folder.entity, name, cSpec).then((entity) => {
					resolve(super.getObject(entity.value));
				});
			});
		});
	}
};
