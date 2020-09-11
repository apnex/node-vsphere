#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class HostNetworkSystem extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	getNetworkInfo() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('networkInfo'));
		});
	}
	getNetworkConfig() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('networkConfig'));
		});
	}
	addPortGroup(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let cSpec = super.buildSpec('HostPortGroupSpec', spec);
			resolve(service.vimPort.addPortGroup(entity, cSpec));
		});
	}
	queryNetworkHint(device) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			resolve(service.vimPort.queryNetworkHint(entity, device));
		});
	}
	removePortGroup(pgName) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			resolve(service.vimPort.removePortGroup(entity, pgName));
		});
	}
	updateVirtualSwitch(vswitchName, spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let cSpec = super.buildSpec('HostVirtualSwitchSpec', spec);
			resolve(service.vimPort.updateVirtualSwitch(entity, vswitchName, cSpec));
		});
	}
	removeVirtualSwitch(vswitchName) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			resolve(service.vimPort.removeVirtualSwitch(entity, vswitchName));
		});
	}
	addVirtualNic(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let portgroup = "none";
			let cSpec = super.buildSpec('HostVirtualNicSpec', spec);
			resolve(service.vimPort.addVirtualNic(entity, portgroup, cSpec));
		});
	}
	updateVirtualNic(device, spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let cSpec = super.buildSpec('HostVirtualNicSpec', spec);
			resolve(service.vimPort.updateVirtualNic(entity, device, cSpec));
		});
	}
	removeVirtualNic(device) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			resolve(service.vimPort.removeVirtualNic(entity, device));
		});
	}
	updateNetworkConfig(config, changeMode = 'modify') {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let cSpec = super.buildSpec('HostNetworkConfig', config);
			resolve(service.vimPort.updateNetworkConfig(entity, cSpec, changeMode));
		});
	}
};
