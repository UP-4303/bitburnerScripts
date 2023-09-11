import { Scanner } from "scanAll.js"
/** @param {NS} ns */
export async function main(ns) {
	var reseau = await Scanner(ns)
	let portCassable = 0
	if (ns.fileExists("BruteSSH.exe", "home")) {
		portCassable = portCassable + 1
	}
	if (ns.fileExists("FTPCrack.exe", "home")) {
		portCassable = portCassable + 1
	}
	if (ns.fileExists("relaySMTP.exe", "home")) {
		portCassable = portCassable + 1
	}
	if (ns.fileExists("HTTPWorm.exe", "home")) {
		portCassable = portCassable + 1
	}
	if (ns.fileExists("SQLInject.exe", "home")) {
		portCassable = portCassable + 1
	}
	let ownLevel = ns.getHackingLevel()-50>0 ? ns.getHackingLevel()-50 : ns.getHackingLevel()

	let id = ns.args[0]

	switch(id) {
		case undefined :
			ns.tprint("Bienvenu dans le programme ultime !")
			ns.tprint("les commandes disponibles sont :")
			ns.tprint("1  - lance/relance la procédure de hacking sur la cible la plus lucrative")
			ns.tprint("2  - achète autant de serveurs que possible")
			ns.tprint("3  - achète x serveurs")
			ns.tprint("4  - arrêt de tous les serveurs")
			ns.tprint("5  - démarage de tous les serveurs sur la cible la plus lucrative")
			ns.tprint("6  - calcul le prix d'serveur ayant X Gb de ram")
			ns.tprint("7  - achète un serveur ayant X Gb de ram")
			ns.tprint("8  - lance les serveurs sur une cible custom")
			ns.tprint("9  - indique la cible la plus lucrative")
			ns.tprint("10 - Solveur de contracts")
			break
		case 1 :
			ns.tprint("lancement/relancement la procédure de hacking sur la cible la plus lucrative en cours")
			let servCrack = 0
			let servHack = 0
			let dispServ = []
			let possServ = []
			for(let cib of reseau){
				if(ns.getServerNumPortsRequired(cib) <= portCassable){
					if(!(ns.hasRootAccess(cib))){
						ns.exec("crack.js", "home", 1, cib)
					}
					servCrack++
					dispServ.push(cib)
				}
			}
			for(let serv of dispServ){
				if(ns.getServerRequiredHackingLevel(serv) <= ownLevel){
					possServ.push(serv)
				}
			}
			let target = possServ.length>0 ? dispServ[0] : undefined
			if(target != undefined){
				for(let ser of possServ){
					if(ns.getServerMoneyAvailable(ser) > ns.getServerMoneyAvailable(target)){
						target = ser
					}
				}
				let moneytresh = ns.getServerMaxMoney(target) * 0.75;
    			let securitytresh = ns.getServerMinSecurityLevel(target) + 5;
				for(let ser of dispServ){
					if(ns.getServerRequiredHackingLevel(ser) < ownLevel && ns.getServerMaxRam(ser) > 0){
						let thread = Math.floor(ns.getServerMaxRam(ser) / ns.getScriptRam("hack.js"));
						ns.killall(ser)
						ns.exec("hack.js", ser, thread, target, moneytresh, securitytresh)
						servHack++
					}
				}
				ns.tprint("hacking terminé, la cible est : "+target)
				ns.tprint("un total de "+servCrack+" sur "+reseau.length+" serveurs ont été cracké")
				ns.tprint("un total de "+servHack+" sur "+reseau.length+" serveurs ont été hacké")
			} else {
				ns.tprint("niveau de hacking insuffisant")
			}
			
			break
		case 2 :
			ns.tprint("achat d'autant de serveurs que possible ...")
			ns.exec("buyServer.js", "home")
			break
		case 3 :
			let num = ns.args[1]
			if(num == undefined) {
				ns.tprint("veuillez donner un nombre de serveurs")
			} else {
				ns.tprint("achat de "+num+" serveurs ...")
			    ns.exec("buyServer.js", "home", 1, num)
			}
			break
		case 4 :
			ns.tprint("arrêt de tous les serveurs ...")
			ns.exec("servkill.js", "home")
			break
		case 5 :
			ns.tprint("démarage/redémarage de tous les serveurs sur la cible la plus lucrative ...")
			ns.exec("servhack.js", "home", 1, portCassable, ownLevel)
			break
		case 6 :
			ns.tprint("calcul du prix du serveur ...")
			let ramC = ns.args[1]
			if(ramC == undefined) {
				ns.tprint("veuillez donner une quantité de RAM")
			} else {
				ns.exec("costServ.js", "home", 1, ramC)
			}
			break
		case 7 :
			ns.tprint("achat du serveur ...")
			let ramA = ns.args[1]
			if(ramA == undefined) {
				ns.tprint("veuillez donner une quantité de RAM")
			} else {
				ns.exec("buyServ.js", "home", 1, ramA)
			}
			break
		case 8 :
			let cib8 = ns.args[1]
			if(cib8 == undefined) {
				ns.tprint("veuillez donner une cible")
			} else {
				ns.exec("customServ.js", "home", 1, cib8, ownLevel, portCassable)
			}
			break
		case 9 :
			ns.tprint("détermination de la cible la plus lucrative en cours")
			let dispServ_ = []
			let possServ_ = []
			for(let cib of reseau){
				if(ns.getServerNumPortsRequired(cib) <= portCassable){
					dispServ_.push(cib)
				}
			}
			for(let serv of dispServ_){
				if(ns.getServerRequiredHackingLevel(serv) <= ownLevel){
					possServ_.push(serv)
				}
			}
			let target_ = possServ_.length>0 ? dispServ_[0] : undefined
			if(target_ != undefined){
				for(let ser of possServ_){
					if(ns.getServerMoneyAvailable(ser) > ns.getServerMoneyAvailable(target_)){
						target_ = ser
					}
				}
			}
			ns.tprint("la cible la plus lucrative est "+ target_)
			break
		case 10 :
			ns.exec("AutoContract.js", "home", 1)
			break
		default :
			ns.tprint("malheureusement cette option n'est pas encore disponible")
			break
	}
}