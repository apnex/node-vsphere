.vnic? |
if (length > 0) then map({
	"device": .device,
	"mac": .spec.mac,
	"ipAddress": .spec.ip.ipAddress,
	"network": .spec.distributedVirtualPort.portgroupKey,
	"netStack": .spec.netStackInstanceKey
}) else empty end
