#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Datacenter extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	createCluster(clusterName, spec = {}) {
		return new Promise((resolve, reject) => {
			super.getObjects({
				type: 'Datacenter',
				pathSet: ['hostFolder']
			}).then((result) => {
				let service = super.service;
				let myDc = result.objects.filter((item) => {
					return (item.obj.value == super.id);
				})[0];
				let folderId = myDc.propSet[0].val.value;
				let taskSpec = service.vim.ClusterConfigSpecEx(spec);
				let entity = service.vim.ManagedObjectReference({
					value: folderId,
					type: "Folder"
				});
				service.vimPort.createClusterEx(entity, clusterName, taskSpec).then((task) => {
					resolve(super.waitForTask(task));
				});
			});
		});
	}
};
