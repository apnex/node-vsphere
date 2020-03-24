#!/usr/bin/env node
const vsphere = require('./dist/vsphere');
const params = require('./params.json');

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = params.hostname;
var username = params.username;
var password = params.password;

function run() {
}

vsphere.vimService(hostname).then((service) => {
	let propertyCollector = service.serviceContent.propertyCollector;
	let rootFolder = service.serviceContent.rootFolder;
        let sessionManager = service.serviceContent.sessionManager;
        let viewManager = service.serviceContent.viewManager;
        let vim = service.vim;
        let vimPort = service.vimPort;

	return vimPort.login(sessionManager, username, password).then(() => {
		return vimPort.createContainerView(viewManager, rootFolder, ["ManagedEntity"], true);
	}).then((containerView) => {
		return vimPort.retrievePropertiesEx(propertyCollector, [
			vim.PropertyFilterSpec({
				objectSet: vim.ObjectSpec({
					obj: containerView,
					skip: true,
					selectSet: vim.TraversalSpec({
						path: "view",
						type: "ContainerView"
					})
				}),
				propSet: vim.PropertySpec({
					//type: "VirtualMachine",
					type: "Network",
					pathSet: ['name']
					//all: true
				})
			})
		], vim.RetrieveOptions());
	}).then((result) => {
		result.objects.forEach((item) => {
			console.log(item.obj.value + ' : ' + item.obj.type + ' : ' + item.propSet[0].val);
		});
		return vimPort.logout(sessionManager);
	});
}).catch(function(err) {
	console.log(err.message);
});
