#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Folder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	async makeDirectory(path, parent = true) {
		let service = this.service;
		let fileManager = service.serviceContent.fileManager;
		let vimPort = service.vimPort;
		let dsName = await this.name();
		let dsFolder = await this.parent();
		let datacenter = await dsFolder.parent();
		let name = '[' + dsName + ']' + path;
		return service.vimPort.makeDirectory(fileManager, name, datacenter.entity, parent).then((result) => {
			return name;
		});
	}
};
