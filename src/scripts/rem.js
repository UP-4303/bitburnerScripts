// REM for RemoteEventManager

/** @param {NS} ns */
export async function main(ns) {
	let targets = [];
	let allServers = [];
	ns.disableLog('ALL');

	allServers.push('home');

	let hackRam = ns.getScriptRam('/scripts/hack.js');
	let weakenRam = ns.getScriptRam('/scripts/weaken.js');
	let growRam = ns.getScriptRam('/scripts/grow.js');
	let moneyThreshold = 1000000;

	while (true) {
		// Get newly hacked servers
		let newServers = ns.read('/signals/newHackedServers.txt').split(',');
		newServers.shift();
		for (let newServer of newServers) {
			if (!targets.includes(newServer)) {
				targets.push(newServer);
			}
			if (!allServers.includes(newServer)) {
				allServers.push(newServer);
			}
		}
		// Erase the content
		ns.write('/signals/newHackedServers.txt', '', 'w');

		// Get newly purchased servers
		let purchasedServers = ns.getPurchasedServers();
		for (let purchasedServer of purchasedServers) {
			if (!allServers.includes(purchasedServer)) {
				allServers.push(purchasedServer);
			}
		}

		// Calculation of total ram
		let ramAvailable = [];
		let totalRam = 0;
		for (let server of allServers) {
			let ram = ns.getServerMaxRam(server);
			if (server == 'home') {
				ram = (ram * 9) / 10;
			}
			totalRam += ram;
			ramAvailable.push({
				name: server,
				ram: ram - ns.getServerUsedRam(server),
			});
		}

		let financialResults = await financialAnalysis(
			ns,
			moneyThreshold,
			targets
		);
		let timeToMoney = financialResults[0];
		let verboseInfos = financialResults[1];

		ns.enableLog('print');
		if (timeToMoney.length > 0) {
			let bestTarget = timeToMoney[0];
			let ramToMoney =
				bestTarget.weakenCount * weakenRam +
				bestTarget.growCount * growRam +
				bestTarget.hackCount * hackRam;
			let threads = Math.floor(totalRam / ramToMoney);
			ns.print('====================');
			ns.print('BEST TARGET :');
			ns.print(bestTarget);
			ns.print(
				'EXPECTED MONEY/S : ',
				(moneyThreshold / bestTarget.time) * threads
			);
			ns.print('WITH ', threads, ' THREADS');
			let verbose = Boolean(Number(ns.read('/signals/remVerbose.txt')));
			if (verbose) {
				ns.print('===============');
				ns.print(verboseInfos);
			}
			await taskDispatcher(
				ns,
				bestTarget,
				ramAvailable,
				hackRam,
				weakenRam,
				growRam
			);
		} else {
			ns.alert('[REM]: OH. NO TARGET FOUND.');
			ns.tprint(verboseInfos);
		}
		ns.disableLog('print');
		
		await ns.sleep(10000);
	}
}

/** @param {NS} ns */
export async function financialAnalysis(ns, moneyThreshold, targets) {
	// Calculation of time to get the k with one thread
	let timeToMoney = [];
	let verboseInfos = [];

	let secUpOnHack = ns.hackAnalyzeSecurity(1);
	let secDownOnWeaken = ns.weakenAnalyze(1);
	let secUpOnGrow = ns.growthAnalyzeSecurity(1);

	for (let target of targets) {
		let verboseInfo = {};
		verboseInfo.name = target;

		let availableMoney = ns.getServerMoneyAvailable(target);
		let maxMoney = ns.getServerMaxMoney(target);
		verboseInfo.availableMoney = availableMoney;
		verboseInfo.maxMoney = maxMoney;

		let priority = availableMoney < maxMoney * 0.9; // If available money is less than 90% of max money, this server should be a prioritised target to get a maximized output in the next financial analysis
		verboseInfo.priority = priority;

		if (availableMoney < 1) {
			availableMoney = 1;
		}

		let hackTime_ = Math.ceil(ns.getHackTime(target) / 1000);
		let moneyHack = ns.hackAnalyze(target);
		let hackChance_ = ns.hackAnalyzeChance(target);
		verboseInfo.hackTime_ = hackTime_;
		verboseInfo.moneyHack = moneyHack;
		verboseInfo.hackChance_ = hackChance_;

		let weakenTime_ = Math.ceil(ns.getWeakenTime(target) / 1000);
		let minSecurity = ns.getServerMinSecurityLevel(target);
		let security_ = ns.getServerSecurityLevel(target);
		verboseInfo.weakenTime_ = weakenTime_;
		verboseInfo.minSecurity = minSecurity;
		verboseInfo.security_ = security_;

		let growTime_ = Math.ceil(ns.getGrowTime(target) / 1000);
		let growParam = ns.getServerGrowth(target) / 100;
		verboseInfo.growTime_ = growTime_;
		verboseInfo.growParam = growParam;

		let growCount = Math.ceil(
			(maxMoney - availableMoney) / availableMoney / growParam +
				(moneyThreshold - availableMoney) / availableMoney / growParam
		);
		if (growCount < 0 || !growCount || !isFinite(growCount)) {
			growCount = 1;
		}
		let hackCount = Math.ceil(
			moneyThreshold /
				(availableMoney * growCount * growParam + 1) /
				moneyHack /
				hackChance_
		);
		if (hackCount < 0 || !hackCount || !isFinite(hackCount)) {
			hackCount = 1;
		}
		let weakenCount = Math.ceil(
			(security_ -
				minSecurity +
				growCount * secUpOnGrow +
				hackCount * secUpOnHack) /
				secDownOnWeaken
		);
		if (weakenCount < 0 || !weakenCount || !isFinite(weakenCount)) {
			weakenCount = 1;
		}

		verboseInfo.growCount = growCount;
		verboseInfo.hackCount = hackCount;
		verboseInfo.weakenCount = weakenCount;

		let time =
			weakenCount * weakenTime_ +
			growCount * growTime_ +
			hackCount * hackTime_;
		verboseInfo.time = time;

		if (time && time != Infinity && time != -Infinity) {
			timeToMoney.push({
				name: target,
				time: time,
				weakenCount: weakenCount,
				growCount: growCount,
				hackCount: hackCount,
				priority: priority,
			});
		}
		verboseInfos.push(verboseInfo);
	}
	timeToMoney.sort((a, b) =>
		a.priority == b.priority ? a.time - b.time : b.priority - a.priority
	);
	return [timeToMoney, verboseInfos];
}

/** @param {NS} ns */
export async function taskDispatcher(
	ns,
	bestTarget,
	ramAvailable,
	hackRam,
	weakenRam,
	growRam
) {
	let weakenCount = bestTarget.weakenCount;
	let growCount = bestTarget.growCount;
	let hackCount = bestTarget.hackCount;

	// Launch !
	while (ramAvailable.length > 0) {
		// If script is needed
		if (
			weakenCount >= growCount &&
			weakenCount >= hackCount &&
			ramAvailable[0].ram >= weakenRam
		) {
			let threads = Math.floor(ramAvailable[0].ram / weakenRam);
			ramAvailable[0].ram -= Math.min(weakenRam * threads, weakenCount);
			weakenCount -= threads;
			ns.exec(
				'/scripts/weaken.js',
				ramAvailable[0].name,
				threads,
				bestTarget.name
			);
		} else if (growCount >= hackCount && ramAvailable[0].ram >= growRam) {
			let threads = Math.min(
				Math.floor(ramAvailable[0].ram / growRam),
				growCount
			);
			ramAvailable[0].ram -= growRam * threads;
			growCount -= threads;
			ns.exec(
				'/scripts/grow.js',
				ramAvailable[0].name,
				threads,
				bestTarget.name
			);
		} else if (ramAvailable[0].ram >= hackRam) {
			let threads = Math.floor(ramAvailable[0].ram / hackRam);
			ramAvailable[0].ram -= Math.min(hackRam * threads, hackCount);
			hackCount -= threads;
			ns.exec(
				'/scripts/hack.js',
				ramAvailable[0].name,
				threads,
				bestTarget.name
			);
			// If not needed, but ram should be used
		} else if (ramAvailable[0].ram >= weakenRam) {
			let threads = Math.floor(ramAvailable[0].ram / weakenRam);
			ramAvailable[0].ram -= weakenRam * threads;
			weakenCount -= threads;
			ns.exec(
				'/scripts/weaken.js',
				ramAvailable[0].name,
				threads,
				bestTarget.name
			);
		} else if (ramAvailable[0].ram >= growRam) {
			let threads = Math.floor(ramAvailable[0].ram / growRam);
			ramAvailable[0].ram -= growRam * threads;
			growCount -= threads;
			ns.exec(
				'/scripts/grow.js',
				ramAvailable[0].name,
				threads,
				bestTarget.name
			);
		} else {
			ramAvailable.shift();
		}

		while (
			(weakenCount <= 0 && bestTarget.weakenCount > 0) ||
			(growCount <= 0 && bestTarget.growCount > 0) ||
			(hackCount <= 0 && bestTarget.hackCount > 0)
		) {
			if (bestTarget.weakenCount > 0) {
				weakenCount += bestTarget.weakenCount;
			}
			if (bestTarget.growCount > 0) {
				growCount += bestTarget.growCount;
			}
			if (bestTarget.hackCount > 0) {
				hackCount += bestTarget.hackCount;
			}
		}
	}
	return;
}
