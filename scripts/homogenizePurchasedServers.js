/** @param {NS} ns */
export async function main(ns) {
	let ram = Number(ns.read("/signals/purchasedServerRam.txt"));
	ns.tprint("PRICE FOR ", ram, "Go : ", ns.getPurchasedServerCost(ram));
	let purchasedServers = ns.getPurchasedServers();
	let index = 0;
	for(let server of purchasedServers){
		ns.renamePurchasedServer(server, 'server-' + '0000'.substring(String(index).length) + String(index));
		index++;
	}
	purchasedServers = ns.getPurchasedServers();
	for (let server of purchasedServers){
		ns.upgradePurchasedServer(server,ram)
	}

	ns.tprint('RESULT ', ns.getPurchasedServers().map(server => { return {
		"name":server,
		"ram":ns.getServerMaxRam(server)	
	}}));
}