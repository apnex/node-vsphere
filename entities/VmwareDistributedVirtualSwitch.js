#!/usr/bin/env node
'use strict';
const DistributedVirtualSwitch = require('./DistributedVirtualSwitch');

module.exports = class VmwareDistributedVirtualSwitch extends DistributedVirtualSwitch {
	constructor(service, id) {
		super(service, id);
	}
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let cSpec = super.buildSpec('VMwareDVSConfigSpec', spec);
			let me = service.vim.ManagedObjectReference({
				type: "DistributedVirtualSwitch",
				value: this.id
			});
			service.vimPort.reconfigureDvsTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
