#!/usr/bin/env node
const vsphere = require("./dist/vsphere");

// ignore self-signed certificate
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;
var hostname = "vcenter.lab";
var username = "administrator@vsphere.local";
var password = "ObiWan1!";

vsphere.vimService(hostname).then(function(service) {
   let propertyCollector = service.serviceContent.propertyCollector,
        rootFolder = service.serviceContent.rootFolder,
            sessionManager = service.serviceContent.sessionManager,
            viewManager = service.serviceContent.viewManager,
            vim = service.vim,
            vimPort = service.vimPort;
        return vimPort.login(sessionManager, username, password).then(function() {
            return vimPort.createContainerView(viewManager, rootFolder,
                    [ "ManagedEntity" ], true);
        }).then(function(containerView) {
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
                        type: "VirtualMachine",
                        pathSet: [ "name" ]
                    })
                })
            ], vim.RetrieveOptions());
        }).then(function(result) {
            result.objects.forEach(function(item) {
                console.log(item.propSet[0].val);
            });
            return vimPort.logout(sessionManager);
        });
    }).catch(function(err) {
        console.log(err.message);
    });
