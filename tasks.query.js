#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

vsphere.vimService(hostname).then((service) => {
	let propertyCollector = service.serviceContent.propertyCollector;
	let rootFolder = service.serviceContent.rootFolder;
	let taskManager = service.serviceContent.taskManager;
	let sessionManager = service.serviceContent.sessionManager;
	let viewManager = service.serviceContent.viewManager;
	let vim = service.vim;
	let vimPort = service.vimPort;


	return vimPort.login(sessionManager, username, password).then(() => {
		let taskFilter = vim.TaskFilterSpec({});
		vimPort.createCollectorForTasks(taskManager, taskFilter).then((collector) => {
			let cRef = service.vim.ManagedObjectReference(collector);
			vimPort.readNextTasks(cRef, 10).then((tasks) => {
				console.log(tasks);
			});
		});
		console.log(vimPort);
		// do something
	}).then((result) => {
		//console.log(result);
	});
}).catch(function(err) {
	console.log('MOOOO: ' + err.message);
});
