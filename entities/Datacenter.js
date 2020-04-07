#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Datacenter extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
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
	createCluster(clusterName, spec = {}) {
		return new Promise((resolve, reject) => {
			this.hostFolder().then((folder) => {
				let service = this.service;
				let taskSpec = service.vim.ClusterConfigSpecEx({
					drsConfig: service.vim.ClusterDrsConfigInfo({
						enabled: true
					})
				});
				service.vimPort.createClusterEx(folder.entity, clusterName, taskSpec).then((info) => {
					resolve(info);
				});
			});
		});
	}
};
