#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class NetworkFolder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	createDVS(name, spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let nSpec = super.buildSpec('DVSCreateSpec', spec);
			service.vimPort.createDVSTask(entity, nSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
};
