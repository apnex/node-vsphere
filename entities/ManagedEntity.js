#!/usr/bin/env node
'use strict';
const apiCore = require('./api.Core');
const core = new apiCore();

module.exports = class ManagedEntity {
	constructor(service, id) {
                this.id = id;
		this.service = service;
		this.entity = service.vim.ManagedObjectReference({
			type: core.getEntityType(id),
			value: id
		});
	}
	getProperty(name) {
		return new Promise((resolve, reject) => {
			this.getConfig({
				type: this.entity.type,
				pathSet: [name]
			}).then((result) => {
				resolve(result.objects[0].propSet[0].val);
			});
		});
	}
	name() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('name'));
		});
	}
	parent() {
		return new Promise((resolve, reject) => {
			this.getProperty('parent').then((entity) => {
				resolve(this.getObject(entity.value));
			});
		});
	}
	destroy() {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.destroyTask(entity).then((task) => {
				resolve(core.waitForTask(service, task));
			});
		});
	}
	uploadDsFile(dsName, dcPath, srcFile, dsFile, options) {
		let url = 'https://' + options.hostname + '/folder' + dsFile + '?dcPath=' + dcPath + '&dsName=' + dsName;
		let authHeader = "Basic " + Buffer.from(options.username + ":" + options.password).toString("base64");
		let opts = {
			"headers": {
				"Authorization": authHeader
			}
		};
		return core.uploadFile(url, srcFile, opts);
	}
	getDvsByUuid(uuid) {
		return core.getDvsByUuid(this.service, uuid);
	}
	getConfig(propertySpec) {
		return core.getConfig(this.service, [this.entity], propertySpec);
	}
	get(id) {
		return core.getObject(this.service, id);
	}
	getEntity(id) {
		return core.getEntity(this.service, id);
	}
	getObject(id) {
		return core.getObject(this.service, id);
	}
	getObjects(spec) {
		return core.getObjects(this.service, spec);
	}
	getTaskInfo(task) {
		return core.getTaskInfo(this.service, task);
	}
	waitForTask(task) {
		return core.waitForTask(this.service, task);
	}
	buildSpec(type, spec) {
		return core.buildSpec(this.service, type, spec);
	}
};
