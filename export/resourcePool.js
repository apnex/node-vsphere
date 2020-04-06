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
	let spec = {
		cpuAllocation: {},
		memoryAllocation: {}
	};

	let rootPool = client.getManagedEntity('resgroup-14');
	console.log(JSON.stringify(rootPool, null, "\t"));
	rootPool.createResourcePool('mynewpool').then((info) => {
		console.log('end of operations');
	});
});
