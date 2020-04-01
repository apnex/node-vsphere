#!/usr/bin/env node
const vsphere = require('../dist/vsphere');
const ora = require('ora');

// Core to have knowledge of all Managed Entity sub-types, so that they can be returned as method-bound objects

// constructor
function apiCore() {
	this.getObjects = getObjects;
	this.getTaskInfo = getTaskInfo;
	this.waitForTask = waitForTask;
}
module.exports = apiCore;

// getTaskInfo
function getTaskInfo(service, task) {
	return new Promise((resolve, reject) => {
		let propertyCollector = service.serviceContent.propertyCollector;
		let vimPort = service.vimPort;
		let vim = service.vim;
		let taskObj = vim.ManagedObjectReference(task);
		vimPort.retrievePropertiesEx(propertyCollector, [
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

// waitForTask
function waitForTask(service, task) {
	return new Promise((resolve, reject) => {
		const spinner = ora({spinner: 'bouncingBall'});
		let loop = setInterval(() => {
			this.getTaskInfo(service, task).then((taskInfo) => {
				if(!spinner.isSpinning) {
					spinner.start(taskInfo.key.padEnd(30, '.') + taskInfo.name.padEnd(30, '.') + taskInfo.state.padEnd(30, '.'));
				}
				/*let progress = '--';
				if(typeof(taskInfo.progress) != 'undefined') {
					progress = taskInfo.progress;
				}*/
				if(taskInfo.state != 'running') {
					clearInterval(loop);
					spinner.succeed();
					//spinner.stop();
					resolve(taskInfo);
				}
			});
		}, 1000);
	});
}

// getObjects
function getObjects(service, propertySpec) {
	let propertyCollector = service.serviceContent.propertyCollector;
	let rootFolder = service.serviceContent.rootFolder;
        let viewManager = service.serviceContent.viewManager;
        let vimPort = service.vimPort;
        let vim = service.vim;
	return vimPort.createContainerView(viewManager, rootFolder, ["ManagedEntity"], true).then((containerView) => {
		return vimPort.retrievePropertiesEx(propertyCollector, [
			vim.PropertyFilterSpec({
				objectSet: vim.ObjectSpec({
					obj: containerView,
					skip: true,
					selectSet: vim.TraversalSpec({
						path: "view",
						type: "ContainerView"
					})
				}),
				propSet: vim.PropertySpec(propertySpec)
			})
		], vim.RetrieveOptions());
	});
}
