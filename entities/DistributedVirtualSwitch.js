#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class DistributedVirtualSwitch extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('config'));
		});
	}
	uuid() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('uuid'));
		});
	}
	createPortgroup(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let pgSpec = super.buildSpec('DVPortgroupConfigSpec', spec);
			service.vimPort.createDVPortgroupTask(this.entity, pgSpec).then((task) => {
				super.waitForTask(task).then((info) => {
					resolve(super.getObject(info.result.value));
				});
			});
                });
        }
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cSpec = super.buildSpec('DVSConfigSpec', spec);
			service.vimPort.reconfigureDvsTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
                });
        }
};
