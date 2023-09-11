/** @param {NS} ns */
export async function main(ns) {
	let ram = ns.args[0]
	let cost =  ns.getPurchasedServerCost(ram)
	ns.tprint("un serveur avec "+ram+" Gb de RAM coute "+cost)
}