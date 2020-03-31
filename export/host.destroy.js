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
	let host = client.getManagedEntity('host-188'); // returns HostSystem
	host.enterMaintenanceMode({timeout: 10}).then((success) => {
		return host.destroy();
	});
});
