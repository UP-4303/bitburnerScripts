/** @param {NS} ns */
export async function main(ns) {
	let cib = ns.args[0]
	let ownLevel = ns.args[1]
	let portsCessable = ns.args[2]

	if(ownLevel >= ns.getServerRequiredHackingLevel(cib) && portsCessable >= ns.getServerNumPortsRequired(cib)){
		let servs = ns.getPurchasedServers()
		for(let serv of servs){
			ns.killall(serv)
			let moneytresh = ns.getServerMaxMoney(cib) * 0.75;
    		let securitytresh = ns.getServerMinSecurityLevel(cib) + 5;
			let thread = Math.floor(ns.getServerMaxRam(serv) / ns.getScriptRam("hack.js"));
			ns.exec("hack.js", serv, thread, cib, moneytresh, securitytresh)
		}
		ns.tprint("hacking sucess")
	}else{
		ns.tprint("niveau insuffisant")
	}
}