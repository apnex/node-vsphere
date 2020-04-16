#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Network extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	name() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('name'));
		});
	}
};
