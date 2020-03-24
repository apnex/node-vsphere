#!/usr/bin/env node
const util = require('util')
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

	//console.log(rootFolder);
	return vimPort.login(sessionManager, username, password).then(() => {
		return vimPort.createDatacenter(rootFolder, 'New');
	}).then((result) => {
		console.log(result);
	});
}).catch(function(err) {
	console.log('MOOOO: ' + err.message);
});
