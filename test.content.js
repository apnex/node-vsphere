#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');
var util = require('util');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

// hostname, username, password
vspLogin(hostname, username, password).then((service) => {
	let test = service.
}).then((result) => {
	console.log('something.... ');
}).catch(function(err) {
	console.log('[ERROR]: ' + err.message);
});

function vspLogin(hostname, username, password) {
	return new Promise(function(resolve, reject) {
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
