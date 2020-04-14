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
	getProperty(name) { // too inefficient - work out how to target specific MOB object
		return new Promise((resolve, reject) => {
			this.getObjects({
				type: core.getEntityType(this.id),
				pathSet: [name]
			}).then((result) => {
				let myItem = result.objects.filter((item) => {
					return (item.obj.value == this.id);
				})[0];
				resolve(myItem.propSet[0].val);
			});
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
	getDvsByUuid(uuid) {
		return core.getDvsByUuid(this.service, uuid);
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
