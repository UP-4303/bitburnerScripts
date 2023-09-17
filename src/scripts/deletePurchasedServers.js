/** @param {NS} ns */
export async function main(ns) {
	let purchasedServers = ns.getPurchasedServers();
	for (let purchasedServer of purchasedServers) {
		ns.deleteServer(purchasedServer);
	}
}