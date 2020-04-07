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
				let service = this.service;
				let myDc = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				let folderId = myDc.propSet[0].val.value;
				let folder = super.getEntity(folderId);
				let taskSpec = service.vim.ClusterConfigSpecEx(spec);
				console.log('Folder: ' + folderId);
				console.log('Entity: ' + JSON.stringify(folder.entity, null, "\t"));
				console.log('TaskSpec: ' + taskSpec);
				service.vimPort.createClusterEx(folder.entity, clusterName, taskSpec).then((info) => {
					resolve(info);
				});
			});
		});
	}
};
