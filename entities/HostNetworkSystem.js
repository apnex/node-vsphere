#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class HostNetworkSystem extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
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
};
