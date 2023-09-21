/** @param {NS} ns */
export function scan(ns) {
	let home = {
		name: 'home',
		level: 0,
	};
	let hosts = [home];
	let unscanned = [home];

	while (unscanned.length > 0) {
		let hostScan = unscanned.shift();
		let newHostsNames = ns.scan(hostScan.name);

		newHostsNames.reverse();

		let indexScan = hosts.indexOf(hostScan);
		let levelScan = hostScan.level;

		for (let newHostName of newHostsNames) {
			if (!hosts.map((host) => host.name).includes(newHostName)) {
				let newHost = { name: newHostName, level: levelScan + 1 };

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
	let scripts = [
		'FTPCrack.exe',
		'HTTPWorm.exe',
		'relaySMTP.exe',
		'SQLInject.exe',
		'BruteSSH.exe',
	];
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
	ns.scp('/scripts/hack.js', targetName);
	ns.scp('/scripts/weaken.js', targetName);
	ns.scp('/scripts/grow.js', targetName);
}

/** @param {NS} ns */
export async function breachAndDeploy(ns, target) {
	ns.run('/scripts/breacher.js', 1, target.name);
	deploy(ns, target.name);
}

/** @param {NS} ns */
export function targetFinancialInfos(ns, target, pids) {
	let financialInfos = {};
	financialInfos.name = target;

	financialInfos.availableMoney = ns.getServerMoneyAvailable(target);
	financialInfos.maxMoney = ns.getServerMaxMoney(target);

	financialInfos.priority = financialInfos.availableMoney < financialInfos.maxMoney * 0.9; // If available money is less than 90% of max money, this server should be a prioritised target to get a maximized output in the next financial analysis

	if (financialInfos.availableMoney < 1) {
		financialInfos.availableMoney = 1;
	}

	financialInfos.hackTime_ = Math.ceil(ns.getHackTime(target) / 1000);
	financialInfos.moneyHack = ns.hackAnalyze(target);
	financialInfos.hackChance_ = ns.hackAnalyzeChance(target);

	financialInfos.weakenTime_ = Math.ceil(ns.getWeakenTime(target) / 1000);
	financialInfos.minSecurity = ns.getServerMinSecurityLevel(target);
	financialInfos.security_ = ns.getServerSecurityLevel(target);

	financialInfos.growTime_ = Math.ceil(ns.getGrowTime(target) / 1000);
	financialInfos.growParam = ns.getServerGrowth(target) / 100;

	pids.forEach((pid, index) => {
		if (!ns.isRunning(pid)) {
			pids.splice(index, 1);
		}
	});

	financialInfos.pids = pids;

	return financialInfos;
}
