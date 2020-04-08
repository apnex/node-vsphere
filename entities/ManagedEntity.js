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
	/*
	set entity(entityId) {
		this._entity = this._createEntityname = name.charAt(0).toUpperCase() + name.slice(1);
	}
	get name() {
		return this._name;
	}
	*/
	destroy() {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			service.vimPort.destroyTask(entity).then((task) => {
				resolve(core.waitForTask(service, task));
			});
		});
	}
	get(id) {
		return core.getObject(this.service, id);
	}
	getEntity(id) {
		return core.getEntity(this.service, id);
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
};