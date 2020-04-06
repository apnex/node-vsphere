#!/usr/bin/env node
const vsphere = require('../dist/vsphere');
const ora = require('ora');

// constructor
function apiCore() {
	this.getEntityType = getEntityType;
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
			this.getTaskInfo(service, task).then((info) => {
				if(!spinner.isSpinning) {
					spinner.start(info.key.padEnd(20, ' ') + info.name.padEnd(30, ' ') + info.entityName.padEnd(20, ' ') + info.state.padEnd(20, ' '));
					//console.log(JSON.stringify(taskInfo, null, "\t"));
				} else {
					spinner.text = info.key.padEnd(20, ' ') + info.name.padEnd(30, ' ') + info.entityName.padEnd(20, ' ') + info.state.padEnd(20, ' ');
				}
				if(info.state != 'running') {
					clearInterval(loop);
					spinner.succeed();
					resolve(info);
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

// getEntityType
function getEntityType(id) {
	switch(true) {
		case /^datacenter-/.test(id):
			return('Datacenter');
		break;
		case /^domain-c/.test(id):
			return('ClusterComputeResource');
		break;
		case /^host-/.test(id):
			return('HostSystem');
		break;
		case /^resgroup-/.test(id):
			return('ResourcePool');
		break;
		case /^vm-/.test(id):
			return('VirtualMachine');
		break;
		case /^group-/.test(id):
			return('Folder');
		break;
		default:
			console.log('No ides what [' + id + ']');
		break;
	}
}
