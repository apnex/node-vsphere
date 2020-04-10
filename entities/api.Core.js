#!/usr/bin/env node
const vsphere = require('../dist/vsphere');
const ora = require('ora');

// constructor
function apiCore() {
	this.getEntity = getEntity;
	this.getEntityType = getEntityType;
	this.getObject = getObject; // temp hack for folder subtypes
	this.getObjectType = getObjectType; // temp have for folder subtypes
	this.getObjects = getObjects;
	this.getTaskInfo = getTaskInfo;
	this.waitForTask = waitForTask;
	this.buildSpec = buildSpec;
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
					spinner.start(info.key.padEnd(20, ' ') + info.name.padEnd(30, ' ') + info.entityName.padEnd(20, ' ') + info.state.padEnd(15, ' '));
				} else {
					spinner.text = info.key.padEnd(20, ' ') + info.name.padEnd(30, ' ') + info.entityName.padEnd(20, ' ') + info.state.padEnd(15, ' ');
				}
				switch(info.state) {
					case 'error':
						clearInterval(loop);
						spinner.text += info.error.localizedMessage;
						if(info.error.fault.faultMessage.length > 0) {
							spinner.text += (' ' + info.error.fault.faultMessage[0].message);
						}
						spinner.fail();
						reject(info);
						//resolve(info);
					break;
					case 'success':
						clearInterval(loop);
						spinner.succeed();
						resolve(info);
					break;
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

// getObject
function getObject(service, id) {
	let match = this.getObjectType(id);
	let type = [
		'Datacenter',
		'ClusterComputeResource',
		'HostSystem',
		'ResourcePool',
		'VirtualApp',
		'VirtualMachine',
		'DatacenterFolder',
		'VmFolder',
		'HostFolder',
		'StorageFolder',
		'NetworkFolder'
	].filter((item) => {
		return item == match;
	})[0];
	if(typeof(type) !== 'undefined') {
		const entityClass = require('./' + type);
		return(new entityClass(service, id));
	}
}

// getObjectType
function getObjectType(id) {
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
		case /^resgroup-v/.test(id):
			return('VirtualApp');
		break;
		case /^resgroup-/.test(id):
			return('ResourcePool');
		break;
		case /^vm-/.test(id):
			return('VirtualMachine');
		break;
		case /^group-d/.test(id):
			return('DatacenterFolder');
		break;
		case /^group-v/.test(id):
			return('VmFolder');
		break;
		case /^group-h/.test(id):
			return('HostFolder');
		break;
		case /^group-s/.test(id):
			return('StorageFolder');
		break;
		case /^group-n/.test(id):
			return('NetworkFolder');
		break;
		default:
			console.log('No idea what [' + id + ']');
		break;
	}
}

// getEntity
function getEntity(service, id) {
	let type = [
		'Datacenter',
		'ClusterComputeResource',
		'HostSystem',
		'ResourcePool',
		'VirtualMachine',
		'Folder'
	].filter((item) => {
		return item == this.getEntityType(id);
	})[0];
	if(typeof(type) !== 'undefined') {
		const entityClass = require('./' + type);
		return(new entityClass(service, id));
	}
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
			console.log('No idea what is [' + id + ']');
		break;
	}
}

function buildSpec(service, type, spec) {
	let body = {};
	if(typeof(spec.discriminator) !== 'undefined') { // override
		type = spec.discriminator;
	}
	Object.entries(spec).forEach((item) => {
		if(item[0] != 'discriminator') {
			if(typeof(item[1]) === 'object') {
				let child = type.toString();
				//if(typeof(defs[type]) !== 'undefined' && typeof(defs[type][item[0]]) !== 'undefined') {
				//	child = defs[type][item[0]];
				//}
				if(Array.isArray(item[1])) { // Array
					body[item[0]] = [];
					item[1].forEach((value) => { // forEach item in array
						if(typeof(value) === 'object') { // object
							body[item[0]].push(this.buildSpec(service, child, value));
						} else { // string
							body[item[0]].push(value);
						}
					});
				} else { // Object
					body[item[0]] = this.buildSpec(service, child, item[1]);
				}
			} else {
				body[item[0]] = item[1];
			}
		}
	});
	return service.vim[type](body);
}
