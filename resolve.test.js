#!/usr/bin/env node
const resolver = require('./resolver');

// called from shell
var spec = require('./config/proxy.json');
var netSpec = resolver(spec, 'HostNetworkConfig');
console.log(JSON.stringify(netSpec, null, "\t"));
