#!/usr/bin/env node
'use strict';
const apiCore = require('./api.Core');
const core = new apiCore();

module.exports = class ManagedEntity {
	constructor(service, id) {
		console.log('construct id[' + id + ']');
                this.id = id;
		this.service = service;

		// discover from id??
		this.entity = service.vim.ManagedObjectReference({
			type: 'HostSystem',
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
