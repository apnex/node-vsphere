#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class HostVirtualNicManager extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	getInfo() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('info'));
		});
	}
};
