#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ComputeResource extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	network() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('network'));
		});
	}
	datastore() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('datastore'));
		});
	}
	getNetworkList() {
		return this['network']().then(async(items) => {
			return Promise.all(items.map((entity) => {
				return this.getObject(entity.value);
			}));
		});
	}
	getDatastoreList() {
		return this['datastore']().then(async(items) => {
			return Promise.all(items.map((entity) => {
				return this.getObject(entity.value);
			}));
		});
	}
};
