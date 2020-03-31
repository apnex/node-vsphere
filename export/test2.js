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
	let cluster = client.getManagedEntity('domain-c137');
	cluster.addHost({
		force: 1,
		hostName: '172.16.10.30',
		userName: 'root',
		password: 'VMware1!',
		port: 443
	}).then((success) => {
		console.log('success!!!!!');
	});
});
