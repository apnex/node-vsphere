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
		let dsFolder = await this.parent();
		let dsName = await this.name();
		let datacenter = await dsFolder.parent();
		let name = '[' + dsName + ']' + path;
		return service.vimPort.makeDirectory(fileManager, name, datacenter.entity, parent).then((result) => {
			return name;
		});
	}
	async uploadFile(srcFile, dsFile) {
		let dsFolder = await this.parent();
		let dc = await dsFolder.parent();
		let dsName = await this.name();
		let dcName = await dc.name();
		let options = {
			'hostname': process.env.VMWJS_HOST,
			'username': process.env.VMWJS_USER,
			'password': process.env.VMWJS_PASS
		};
		let result = await this.uploadDsFile(dsName, dcName, srcFile, dsFile, options);
		let name = '[' + dsName + ']' + dsFile;
		return name;
	}
};
