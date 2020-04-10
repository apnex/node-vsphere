#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Datacenter extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	hostFolder() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('hostFolder'));
		});
	}
	networkFolder() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('networkFolder'));
		});
	}
	vmFolder() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('vmFolder'));
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
