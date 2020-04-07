#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class NetworkFolder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
};
