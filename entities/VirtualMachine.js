#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class VirtualMachine extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	config() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('config'));
		});
	}
	runtime() {
		return new Promise((resolve, reject) => {
			resolve(this.getProperty('runtime'));
		});
	}
	getHardware() {
		return new Promise((resolve, reject) => {
			this.config().then((config) => {
				// mark discriminator here!
				let devices = config.hardware.device;
				//let deviceList = [];
				devices.forEach((device) => {
					device['discriminator'] = this.getHardwareType(device);
					//deviceList.push(device);
				});
				//return deviceList;
				resolve(config.hardware);
			});
		});
	}
	getHost() {
		return new Promise((resolve, reject) => {
			this.runtime().then((state) => {
				resolve(this.getObject(state.host.value));
			});
		});
	}
	powerOn() {
		return new Promise((resolve, reject) => {
			this.service.vimPort.powerOnVMTask(this.entity).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
	powerOff() {
		return new Promise((resolve, reject) => {
			this.service.vimPort.powerOffVMTask(this.entity).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
	reconfigure(spec) {
		return new Promise((resolve, reject) => {
			let service = this.service;
			let cSpec = super.buildSpec('VirtualMachineConfigSpec', spec);
			service.vimPort.reconfigVMTask(this.entity, cSpec).then((task) => {
				resolve(super.waitForTask(task));
			});
		});
	}
	getHardwareType(device) {
		let key = device.key;
		if(key >= 100 && key <= 109) {
			if(device.deviceInfo.label.match(/^PCI/)) {
				return('VirtualPCIController');
			}
		}
		if(key >= 200 && key <= 209) {
			if(device.deviceInfo.label.match(/^IDE/)) {
				return('VirtualIDEController');
			}
		}
		if(key >= 300 && key <= 309) {
			if(device.deviceInfo.label.match(/^PS2/)) {
				return('VirtualPS2Controller');
			}
		}
		if(key >= 400 && key <= 409) {
			if(device.deviceInfo.label.match(/^SIO/)) {
				return('VirtualSIOController');
			}
		}
		if(key >= 500 && key <= 509) {
			if(device.deviceInfo.label.match(/^Video/)) {
				return('VirtualMachineVideoCard');
			}
		}
		if(key >= 600 && key <= 609) {
			if(device.deviceInfo.label.match(/^Keyboard/)) {
				return('VirtualKeyboard');
			}
		}
		if(key >= 700 && key <= 709) {
			if(device.deviceInfo.label.match(/^Pointing/)) {
				return('VirtualPointingDevice');
			}
		}
		if(key >= 4000 && key <= 4009) {
			if(device.deviceInfo.label.match(/^Network/)) {
				return('VirtualVmxnet3');
			}
		}
		if(key >= 12000 && key <= 12009) {
			if(device.deviceInfo.label.match(/^VMCI/)) {
				return('VirtualMachineVMCIDevice');
			}
		}
		if(key >= 15000 && key <= 15009) {
			if(device.deviceInfo.label.match(/^SATA/)) {
				return('VirtualAHCIController');
			}
		}
		if(key >= 16000 && key <= 16009) {
			if(device.deviceInfo.label.match(/^CD\/DVD/)) {
				return('VirtualCdrom');
			} else if(device.deviceInfo.label.match(/^Hard disk/)) {
				return('VirtualDisk');
			}
		}
	}
};
