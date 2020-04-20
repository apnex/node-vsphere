#!/usr/bin/env node
'use strict';
const ManagedEntity = require('./ManagedEntity');

module.exports = class Folder extends ManagedEntity {
	constructor(service, id) {
		super(service, id);
	}
	async makeDirectory(path, parent = true) {
		let service = this.service;
		let fileManager = service.serviceContent.fileManager;
		let vimPort = service.vimPort;
		let dsName = await this.name();
		let dsFolder = await this.parent();
		let datacenter = await dsFolder.parent();
		let name = '[' + dsName + ']' + path;
		return service.vimPort.makeDirectory(fileManager, name, datacenter.entity, parent).then((result) => {
			return name;
		});
	}
	async uploadFile(srcFile, dsFile) {
		const stream = require('stream');
		const {promisify} = require('util');
		const fs = require('fs');
		const got = require('got');
		const ora = require('ora');
		const pipeline = promisify(stream.pipeline);
		var options = {
			'username': 'administrator@vsphere.local',
			'password': 'ObiWan1!'
		};
		var authHeader = "Basic " + Buffer.from(options.username + ":" + options.password).toString("base64");
		var srcFile = './newticle.iso';
		var dcPath = 'site01';
		var dsName = 'ds-local';
		var dsFile = '/iso/newticle.iso';
		var fileSize = fs.statSync(srcFile).size;
		var hosturl = 'https://vcenter7.lab/folder' + dsFile + '?dcPath=' + dcPath + '&dsName=' + dsName;

		const spinner = ora({spinner: 'bouncingBall'});
		return pipeline(
			fs.createReadStream(srcFile),
			got.stream.put(hosturl, {
				headers: {
			        	"Authorization": authHeader,
					"Content-Length": fileSize
				}
			}).on('uploadProgress', progress => {
				if(progress.percent == 1) {
					spinner.text = "% 100" + "\t" + progress.transferred + "\t" + progress.total + " [" + dsName + "]" + dsFile;
					spinner.succeed();
					return;
				} else {
					if(!spinner.isSpinning) {
						spinner.start("% " + progress.percent + "\t" + progress.transferred + "\t" + progress.total + " [" + dsName + "]" + dsFile);
					} else {
						spinner.text = "% " + progress.percent + "\t" + progress.transferred + "\t" + progress.total + " [" + dsName + "]" + dsFile;
					}
				}
			})
		);
	}
};
