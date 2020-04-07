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
		});
	}
	createVApp(name, {
		resSpec = this.service.vim.ResourceConfigSpec({
			cpuAllocation: this.service.vim.ResourceAllocationInfo({
				expandableReservation: true,
				reservation: 0,
				limit: -1,
				shares: this.service.vim.SharesInfo({
					level: 'normal',
					shares: 4000
				})
			}),
			memoryAllocation: this.service.vim.ResourceAllocationInfo({
				expandableReservation: true,
				reservation: 0,
				limit: -1,
				shares: this.service.vim.SharesInfo({
					level: 'normal',
					shares: 163480
				})
			})
		}),
		configSpec = this.service.vim.VAppConfigSpec({})
	} = {}) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let entity = this.entity;
			let vmFolder = super.getEntity('group-v4'); // remove static entry!!!
			console.log(JSON.stringify(vmFolder, null, "\t"));
			return service.vimPort.createVApp(entity, name, resSpec, configSpec, vmFolder.entity);
		});
	}
};
