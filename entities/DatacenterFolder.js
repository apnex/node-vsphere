#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class DatacenterFolder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	createDatacenter(dcName) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let rootFolder = service.serviceContent.rootFolder;
			service.vimPort.createDatacenter(rootFolder, dcName).then((task) => {
				resolve(task);
			});
		});
	}
};
