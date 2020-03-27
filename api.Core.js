#!/usr/bin/env node
const vsphere = require('./dist/vsphere');

// constructor
function apiCore(opts) {
	this.options =  Object.assign({}, opts);
	this.vspLogin = vspLogin;
	this.getObjects = getObjects;
	this.getTasks = getTasks;
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

// getTask
function getTasks(service, taskId, clusterId) {
	let taskManager = service.serviceContent.taskManager;
        let vimPort = service.vimPort;
        let vim = service.vim;

	console.log(clusterId + 'moo');
	let taskFilter = vim.TaskFilterSpec({
		/*entity: vim.TaskFilterSpecByEntity({
			entity: vim.ManagedObjectReference({
				value: clusterId,
				type: "ClusterComputeResource"
			}),
			recursion: 'self'
		})*/
		state: 'running'
	});
	vimPort.createCollectorForTasks(taskManager, taskFilter).then((collector) => {
		let cRef = vim.ManagedObjectReference(collector);
		vimPort.readNextTasks(cRef, 10).then((tasks) => {
			console.log(tasks);
		});
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
