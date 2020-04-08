#!/usr/bin/env node
'use strict';
const ResourcePool = require('./ResourcePool');

module.exports = class VirtualApp extends ResourcePool {
	constructor(service, id) {
		console.log('VAPP: ' + id);
		super(service, id);
	}
};
