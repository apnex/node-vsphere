#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class ResourcePool extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	createResourcePool(name, {
		cpuAllocation = {
			expandableReservation: true,
			reservation: 0,
			limit: -1,
			shares: this.service.vim.SharesInfo({
				level: 'normal',
				shares: 4000
			})
		},
		memoryAllocation = {
			expandableReservation: true,
			reservation: 0,
			limit: -1,
			shares: this.service.vim.SharesInfo({
				level: 'normal',
				shares: 163480
			})
		}
	} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let spec = service.vim.ResourceConfigSpec({
					cpuAllocation: service.vim.ResourceAllocationInfo(cpuAllocation),
					memoryAllocation: service.vim.ResourceAllocationInfo(memoryAllocation)
			});
			return service.vimPort.createResourcePool(entity, name, spec);
			/*.then((info) => {
				resolve(info);
			})*/
			console.log(JSON.stringify(spec, null, "\t"));
		});
	}
};
