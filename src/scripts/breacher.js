import { openPortLevel } from "/scripts/lib.js";

/** @param {NS} ns */
export async function main(ns) {
	let targetName = ns.args[0];
	ns.print("BREACHING ", targetName);

	let scripts = openPortLevel(ns, true);
	if (scripts.includes("FTPCrack.exe")) {
		ns.ftpcrack(targetName);
	}
	if (scripts.includes("HTTPWorm.exe")) {
		ns.httpworm(targetName);
	}
	if (scripts.includes("relaySMTP.exe")) {
		ns.relaysmtp(targetName);
	}
	if (scripts.includes("SQLInject.exe")) {
		ns.sqlinject(targetName);
	}
	if (scripts.includes("BruteSSH.exe")) {
		ns.brutessh(targetName);
	}
	ns.nuke(targetName);
}