import { scan, deploy } from "/scripts/lib.js";

/** @param {NS} ns */
export async function main(ns) {
	let allServers = scan(ns).map(a => a.name);
	let purchasedServers = ns.getPurchasedServers();
	for (let purchasedServer of purchasedServers) {
		allServers.push(purchasedServer);
	}

	for (let server of allServers){
		deploy(ns, server);
	}
}