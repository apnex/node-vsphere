#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ComputeResource extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	network() {
		return new Promise((resolve, reject) => {
			//resolve(this.getProperty('network'));
			this.getProperty('network').then((networks) => {
				console.log(JSON.stringify(networks, null, "\t"));
			});
		});
	}
};
