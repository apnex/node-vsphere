#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class VmFolder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
};
