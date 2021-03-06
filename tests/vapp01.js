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
	let ResourceConfigSpec = {
		cpuAllocation: {},
		memoryAllocation: {}
	};

	let dc = client.getManagedEntity('datacenter-3');
	dc.createCluster('cluster16').then((info) => {
		let cluster = client.getManagedEntity(info.value);
		return cluster.addHost({
			force: 1,
			hostName: '172.16.10.30',
			userName: 'root',
			password: 'VMware1!',
			port: 443
		}).then((info) => {
			let host = client.getManagedEntity(info.result.value);
			return host.exitMaintenanceMode().then((info) => {
				return host.enterMaintenanceMode();
			}).then((info) => {
				return host.destroy();
			});
		}).then((info) => {
			return cluster.destroy();
		});
	}).then((info) => {
		console.log('end of operations');
	});
});
