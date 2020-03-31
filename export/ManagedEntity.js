#!/usr/bin/env node
'use strict';

module.exports = class ManagedEntity {
	constructor(service, id) {
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
				resolve(task);
			}).catch((err) => {
				reject(err);
			});
		});
	}
	getTaskInfo(task) {
		return new Promise((resolve, reject) => {
			let service = this.service
			let propertyCollector = service.serviceContent.propertyCollector;
			let vim = service.vim;
			let taskObj = vim.ManagedObjectReference(task);
			service.vimPort.retrievePropertiesEx(propertyCollector, [
				vim.PropertyFilterSpec({
					objectSet: vim.ObjectSpec({
						obj: taskObj,
						skip: false
					}),
					propSet: vim.PropertySpec({
						type: 'Task',
						pathSet: ['info']
					})
				})
			], vim.RetrieveOptions()).then((result) => {
				resolve(result.objects[0].propSet[0].val);
			}).catch((err) => {
				reject(err);
			});
		});
	}
	waitForTask(task) {
		return new Promise((resolve, reject) => {
			let loop = setInterval(() => {
				this.getTaskInfo(task).then((taskInfo) => {
					let progress = '--';
					if(typeof(taskInfo.progress) != 'undefined') {
						progress = taskInfo.progress;
					}
					console.log('task[' + taskInfo.key + '] -- state[' + taskInfo.state + '] -- progress[' + progress + '] -- description[' + taskInfo.descriptionId + ']');
					if(taskInfo.state != 'running') {
						clearInterval(loop);
						resolve(taskInfo);
					}
				});
			}, 1000);
		});
	}
};
