#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// Core to have knowledge of all Managed Entity sub-types, so that they can be returned as method-bound objects

// constructor
function apiCore(opts) {
	this.options =  Object.assign({}, opts);
	this.vspLogin = vspLogin;
	this.getEntity = getEntity;
	this.getObjects = getObjects;
	this.getTaskInfo = getTaskInfo;
	this.waitForTask = waitForTask;
}
module.exports = apiCore;

// login
function vspLogin(hostname, username, password) {
	return new Promise((resolve, reject) => {
		vsphere.vimService(hostname).then((service) => {
			let sessionManager = service.serviceContent.sessionManager;
			let vimPort = service.vimPort;
			vimPort.login(sessionManager, username, password).then(() => {
				resolve(service);
			}).catch(function(err) {
				reject(err);
			});
		}).catch(function(err) {
			reject(err);
		});
	});
};

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
		let loop = setInterval(() => {
			getTaskInfo(service, task).then((taskInfo) => {
				console.log('task[' + taskInfo.key + '] -- state[' + taskInfo.state + '] -- progress[' + taskInfo.progress + ']');
				if(taskInfo.state != 'running') {
					clearInterval(loop);
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

function getEntity(id) {
	switch(true) {
		case /^domain-c/.test(id):
			console.log(id + ' is a ClusterComputeResource');
		break;
		case /^vm-/.test(id):
			console.log(id + ' is a VirtualMachine');
		break;
		case /^host-/.test(id):
			console.log(id + ' is a HostSystem');
		break;
		case /^group-/.test(id):
			console.log(id + ' is a Folder');
		break;
		case /^datacenter-/.test(id):
			console.log(id + ' is a Datacenter');
		break;
		default:
			console.log(id + ' is no idea?');
		break;
	}
}
