#!/usr/bin/env node
'use strict';
const Folder = require('./Folder');

module.exports = class NetworkFolder extends Folder {
	constructor(service, id) {
		super(service, id);
	}
	createDVS(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let nSpec = super.buildSpec('DVSCreateSpec', spec);
			console.log(JSON.stringify(nSpec, null, "\t"));
			service.vimPort.createDVSTask(entity, nSpec).then((task) => {
				super.waitForTask(task).then((info) => {
					resolve(super.getObject(info.result.value));
				});
			});
		});
	}
};
