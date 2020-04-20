#!/usr/bin/env node
'use strict';
const Folder = require('./Folder');

module.exports = class StorageFolder extends Folder {
	constructor(service, id) {
		super(service, id);
	}
};
