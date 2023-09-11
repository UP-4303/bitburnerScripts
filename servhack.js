import { Scanner } from "scanAll.js"
/** @param {NS} ns */
export async function main(ns) {
	var reseau = await Scanner(ns)
	let portcassable = ns.args[0]
	let ownlevel = ns.args[1]
	let target = undefined
	let targ_cible = []
	for(let cible of reseau){
		let nbPort2 = ns.getServerNumPortsRequired(cible)
		let hLevel2 = ns.getServerRequiredHackingLevel(cible)
		if (portcassable >=nbPort2 && ownlevel >= hLevel2) {
			targ_cible.push(cible)
		}
	}
	if(targ_cible.length > 0){
		target = targ_cible[0]
		for(let cib of targ_cible){
			if(ns.getServerMoneyAvailable(cib) > ns.getServerMoneyAvailable(target)) {
				target = cib
			}
			if(!(ns.hasRootAccess(target))) {
        		if (ns.fileExists("BruteSSH.exe", "home")) {
            		ns.brutessh(target);
        		}
        		if (ns.fileExists("FTPCrack.exe", "home")) {
            		ns.ftpcrack(target);
        		}
        		if (ns.fileExists("relaySMTP.exe", "home")) {
            		ns.relaysmtp(target);
        		}
        		if (ns.fileExists("HTTPWorm.exe", "home")) {
            		ns.httpworm(target);
        		}
        		if (ns.fileExists("SQLInject.exe", "home")) {
        		    ns.sqlinject(target);
        		}
        		ns.nuke(target);
    		}
		}
	}
	if(target == undefined) {
		ns.tprint("hacking impossible, niveau insuffisant")
	} else {
		let servs = ns.getPurchasedServers()
		for(let serv of servs) {
			ns.killall(serv)
			let thread = Math.floor(ns.getServerMaxRam(serv) / ns.getScriptRam("hack.js"));
    		let moneyThresh = ns.getServerMaxMoney(target) * 0.75;
    		let securityThresh = ns.getServerMinSecurityLevel(target) + 5;
			ns.exec("hack.js", serv, thread, target, moneyThresh, securityThresh)
		}
		ns.tprint("hacking réussi, "+servs.length+" serveurs dirigés vers "+target)
	}
}