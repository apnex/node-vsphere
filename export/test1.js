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
	let host = client.getManagedEntity('host-1095'); // returns HostSystem entity
	host.exitMaintenanceMode().then((info) => {
		console.log('TASK1 Finish');
		return host.enterMaintenanceMode();
	}).then((info) => {
		console.log('TASK2 Finish');
		return host.exitMaintenanceMode();
	}).then((info) => {
		console.log('TASK3 Finish');
		return host.enterMaintenanceMode();
	}).then((info) => {
		console.log('TASK4 Finish');
	});
});
