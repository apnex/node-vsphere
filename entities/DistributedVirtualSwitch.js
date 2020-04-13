#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class DistributedVirtualSwitch extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(super.getProperty('config'));
		});
	}
	uuid() {
		return new Promise((resolve, reject) => {
			resolve(super.getProperty('uuid'));
		});
	}
	createPortgroup(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let pgSpec = super.buildSpec('DVPortgroupConfigSpec', spec);
			service.vimPort.createDVPortgroupTask(this.entity, pgSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
                });
        }
};
