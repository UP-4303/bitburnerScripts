// us for ultra-scan

import { scan } from "/scripts/lib.js"

/** @param {NS} ns */
export async function main(ns) {
	let hosts = scan(ns);
	await print(ns, hosts);
}

export async function print(ns, hosts) {
	for(let i = 0; i< hosts.length; i++){
		await ns.tprint('-'.repeat(hosts[i]["level"]), hosts[i]["name"]);
	}
}