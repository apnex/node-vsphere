#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class DistributedVirtualPortgroup extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cSpec = super.buildSpec('DVPortgroupConfigSpec', spec);
			service.vimPort.reconfigureDVPortgroupTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
