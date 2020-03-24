#!/usr/bin/env node
const vsphere = require("./dist/vsphere");

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = "vcenter.lab";
var username = "administrator@vsphere.local";
var password = "ObiWan1!";

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
		console.log(JSON.stringify(rootFolder, null, "\t"));
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
					type: "Datacenter",
					pathSet: ["parent"]
					//all: true
				})
			})
		], vim.RetrieveOptions());
	}).then((result) => {
		result.objects.forEach((item) => {
			console.log(JSON.stringify(item, null, "\t"));
			console.log(item.propSet[0].val);
		});
		return vimPort.logout(sessionManager);
	});
}).catch(function(err) {
	console.log('MOOOO: ' + err.message);
});
