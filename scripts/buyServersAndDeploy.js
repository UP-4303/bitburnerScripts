import { deploy } from "/scripts/lib.js";

/** @param {NS} ns */
export async function main(ns) {
	let ram = Number(ns.read("/signals/purchasedServerRam.txt"));
	ns.tprint("PRICE FOR ", ram, "Go : ", ns.getPurchasedServerCost(ram));
	let purchasedServers = ns.getPurchasedServers();
	let index = purchasedServers.length;
	let servNameResult;
	do {
		servNameResult = ns.purchaseServer('server-' + '0000'.substring(String(index).length) + String(index), ram);
		if(servNameResult){
			deploy(ns, servNameResult);
			index++;
		}
	} while (servNameResult != '');
}