#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');
var util = require('util');

// ignore self-signed certificate
// process.env.NODE_NO_WARNINGS = 1; // needs to be set in shell via export
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

// colours
const chalk = require('chalk');
const red = chalk.bold.red;
const orange = chalk.keyword('orange');
const green = chalk.green;
const blue = chalk.blueBright;

// called from shell
const args = process.argv;
if(args[1].match(/HostSystem/g)) {
	if(args[2]) {
		run(args[2]);
	} else {
		console.log('[' + red('ERROR') + ']: usage ' + blue('HostSystem.enterMaintenanceMode <host.id>'));
	}
}

// run
function run(hostId) {
	let taskSpec = {
		timeout: 10 // seconds
	};

	// host maintenance mode
	vspSession(hostname, username, password).then((client) => {
		client.getHostSystem(hostId).then((host) => {
			host.enterMaintenanceMode(taskSpec).then((response) => {
				console.log('enter maintenance success!!!');
			});
		}).catch((err) => {
			console.log('FAIL... ');
		});
	});
}

// session
function vspSession(hostname, username, password) {
	return vspLogin(hostname, username, password).then((service) => {
		return {
			service,
			getHostSystem
		};
	});
}

// client.getHostSystem
function getHostSystem(value) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let type = 'HostSystem';
		resolve({
			service,
			entity: service.vim.ManagedObjectReference({
				value,
				type
			}),
			enterMaintenanceMode,
			exitMaintenanceMode
		});
	});
}

// HostSystem.exitMaintenanceMode
function exitMaintenanceMode(taskSpec) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let entity = this.entity;
		service.vimPort.exitMaintenanceModeTask(entity, taskSpec.timeout).then((task) => {
			// wait for task?
			resolve(task);
		});
	});
}

// HostSystem.enterMaintenanceMode
function enterMaintenanceMode(taskSpec) {
	return new Promise((resolve, reject) => {
		let service = this.service;
		let entity = this.entity;
		service.vimPort.enterMaintenanceModeTask(entity, taskSpec.timeout).then((task) => {
			// wait for task?
			resolve(task);
		});
	});
}

// login
function vspLogin(hostname, username, password) {
	return new Promise((resolve, reject) => {
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
