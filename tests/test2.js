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
	let cluster = client.getManagedEntity('domain-c13');
	cluster.addHost({
		force: 1,
		hostName: '172.16.10.30',
		userName: 'root',
		password: 'VMware1!',
		port: 443
	}).then((info) => {
		let host = client.getManagedEntity(info.result.value);
		host.exitMaintenanceMode({timeout: 1}).then((info) => {
			console.log(JSON.stringify(info, null, "\t"));
			console.log('success!!!!!');
		});;
	});
});
