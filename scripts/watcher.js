import { openPortLevel, scan, breachAndDeploy } from "/scripts/lib.js"

/** @param {NS} ns */
export async function main(ns) {	
	await watcher(ns, scan(ns), breachAndDeploy);
}

/** @param {NS} ns */
export async function watcher(ns, targets, runOnTrigger) {
	let scriptLevel;
	let markedForRemoval = [];
	if (!ns.fileExists("/signals/newHackedServers.txt")){
		await ns.prompt("WARNING : '/signals/newHackedServers.txt' does not exists !");
		return
	}

	// Try until everything is hacked
	while (targets.length > 0) {
		scriptLevel = openPortLevel(ns);

		// Main iteration
		for (let targetIndex in targets) {
			let enoughPorts = ns.getServerNumPortsRequired(targets[targetIndex].name) <= scriptLevel;
			let enoughLevels = ns.getServerRequiredHackingLevel(targets[targetIndex].name) <= ns.getHackingLevel();
			if (enoughPorts && enoughLevels) {
				ns.print("WATCHER 26 ", targets[targetIndex]);
				await runOnTrigger(ns, targets[targetIndex]);
				markedForRemoval.push(targetIndex);
				ns.write("/signals/newHackedServers.txt", ','+targets[targetIndex].name, 'a');
			}
		}

		markedForRemoval.sort((a, b) => b - a);

		// Delete the marked for removal
		while (markedForRemoval.length > 0) {
			targets.splice(markedForRemoval[0], 1);
			markedForRemoval.shift();
		}

		await ns.sleep(10000);
	}
}