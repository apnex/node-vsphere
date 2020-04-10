#!/usr/bin/env node
'use strict';
const DistributedVirtualSwitch = require('./DistributedVirtualSwitch');

module.exports = class VmwareDistributedVirtualSwitch extends DistributedVirtualSwitch {
	constructor(service, id) {
		super(service, id);
	}
};
