#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Folder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	childEntity() {
		return new Promise((resolve, reject) => {
			this.getProperty('childEntity').then((entity) => {
				resolve(entity);
			});
		});
	}
};
