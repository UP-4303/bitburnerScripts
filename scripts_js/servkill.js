/** @param {NS} ns */
export async function main(ns) {
	let servs = ns.getPurchasedServers()
	for(let serv of servs) {
   		ns.killall(serv)
	}
	ns.tprint("tous les serveurs sont arrêté")
}