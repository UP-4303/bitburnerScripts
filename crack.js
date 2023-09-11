/** @param {NS} ns */
export async function main(ns) {

    let target = ns.args[0]
    
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
    
    ns.scp("hack.js", target)
    if(ns.getServerMaxRam(target) >= ns.getScriptRam("backdoor.js")){
        ns.killall(target)
        ns.scp("backdoor.js", target)
    }
}