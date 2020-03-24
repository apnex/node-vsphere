#!/usr/bin/env node
const vsphere = require("./dist/vsphere");

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = "vcenter.lab";
var username = "administrator@vsphere.local";
var password = "ObiWan1!";

function run() {
}

vsphere.vimService(hostname).then((service) => {
	let propertyCollector = service.serviceContent.propertyCollector;
	let rootFolder = service.serviceContent.rootFolder;
        let sessionManager = service.serviceContent.sessionManager;
        let viewManager = service.serviceContent.viewManager;
        let vim = service.vim;
        let vimPort = service.vimPort;

	let mySpec = vim.DVSCreateSpec({
		configSpec: vim.DVSConfigSpec({
			name: 'test-vds'
		})
	});
	let myFolder = vim.ManagedObjectReference({
		value: 'group-n186',
		type: 'Folder'
	});

	return vimPort.login(sessionManager, username, password).then(() => {
		return vimPort.createDVSTask(myFolder, mySpec);
	}).then((result) => {
		console.log(result);
	});
}).catch(function(err) {
	console.log('MOOOO: ' + err.message);
});
