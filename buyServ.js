/** @param {NS} ns */
export async function main(ns) {
	let id = ns.getPurchasedServers().length
	let servName = "Serv_"+id
	let ram = ns.args[0]
	ns.purchaseServer(servName, ram)
	ns.tprint("un serveur avec "+ram+" Gb de RAM a été acheté")
	ns.scp("hack.js", servName)
}