#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Datacenter extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	vmFolder() { // too inefficient - need to move to constructor to setup values once
		return new Promise((resolve, reject) => {
			super.getObjects({
				type: 'Datacenter',
				pathSet: ['vmFolder']
			}).then((result) => {
				let myItem = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				let entityId = myItem.propSet[0].val.value;
				resolve(super.getEntity(entityId));
			});
		});
	}
	hostFolder() { // too inefficient - need to move to constructor to setup values once
		return new Promise((resolve, reject) => {
			super.getObjects({
				type: 'Datacenter',
				pathSet: ['hostFolder']
			}).then((result) => {
				let myItem = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				let entityId = myItem.propSet[0].val.value;
				resolve(super.getEntity(entityId));
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
