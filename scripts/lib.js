/** @param {NS} ns */
export function scan(ns) {
	let home = {
		name: "home",
		level: 0
	}
	let hosts = [home];
	let unscanned = [home];

	while (unscanned.length > 0) {
		let hostScan = unscanned.shift();
		let newHostsNames = ns.scan(hostScan.name);

		newHostsNames.reverse();

		let indexScan = hosts.indexOf(hostScan);
		let levelScan = hostScan.level;

		for (let newHostName of newHostsNames) {
			if (!hosts.map(host => host.name).includes(newHostName)) {
				let newHost = { name: newHostName, level: levelScan + 1 }

				// Add to hosts
				hosts.splice(indexScan + 1, 0, newHost);

				// Add to unscanned
				unscanned.push(newHost);
			}
		}
	}

	return hosts;
}

/** @param {NS} ns */
export function openPortLevel(ns, verbose = false) {
	let scripts = ["FTPCrack.exe", "HTTPWorm.exe", "relaySMTP.exe", "SQLInject.exe", "BruteSSH.exe"];
	let verboseResult = [];
	let scriptLevel = 0;
	for (let script of scripts) {
		if (ns.fileExists(script)) {
			scriptLevel++;
			verboseResult.push(script);
		}
	}
	if (verbose) {
		return verboseResult;
	} else {
		return scriptLevel;
	}
}

/** @param {NS} ns */
export function deploy(ns, targetName) {
	ns.scp("/scripts/hack.js", targetName);
	ns.scp("/scripts/weaken.js", targetName);
	ns.scp("/scripts/grow.js", targetName);
}

/** @param {NS} ns */
export async function breachAndDeploy(ns, target) {
	ns.run("/scripts/breacher.js", 1, target.name);
	deploy(ns, target.name);
}