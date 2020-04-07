#!/usr/bin/env node
'use strict';
const apiClient = require('./api.Client');
const params = require('./params.json');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

let client = new apiClient();
client.vspLogin(hostname, username, password).then((service) => {
	let host = client.getManagedEntity('host-1107');
	host.enterMaintenanceMode().then((info) => {
		console.log('TASK1 Finish');
		return host.destroy();
	}).then((info) => {
		console.log(JSON.stringify(info, null, "\t"));
		console.log('TASK2 Finish');
	});
});
