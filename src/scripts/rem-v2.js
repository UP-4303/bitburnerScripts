// REM for RemoteEventManager

import { targetFinancialInfos } from '/scripts/lib.js';

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
			if (!targets.map((server) => server.name).includes(newServer)) {
				targets.push({ name: newServer, pids: [] });
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

		let pids = {};
		targets.forEach((element) => {
			pids[element.name] = element.pids;
		});

		let timeToMoney = await financialAnalysis(
			ns,
			moneyThreshold,
			targets.map((server) => server.name),
			pids
		);

		ns.enableLog('print');
		if (timeToMoney.length > 0 && timeToMoney[0].targetable == true) {
			ns.print('===============');
			ns.print(timeToMoney);
			await taskDispatcher(
				ns,
				timeToMoney,
				ramAvailable,
				hackRam,
				weakenRam,
				growRam
			);
		} else {
			ns.alert('[REM]: OH. NO TARGET FOUND.');
			ns.print(timeToMoney);
		}
		ns.disableLog('print');

		await ns.sleep(10000);
	}
}

export async function financialAnalysis(ns, moneyThreshold, targets, pids) {
	// Calculation of time to get the moneyThreshold with one thread
	let timeToMoney = [];

	let secUpOnHack = ns.hackAnalyzeSecurity(1);
	let secDownOnWeaken = ns.weakenAnalyze(1);
	let secUpOnGrow = ns.growthAnalyzeSecurity(1);

	for (let targetName of targets) {
		let target = targetFinancialInfos(
			ns,
			targetName,
			pids[targetName] ? pids[targetName] : []
		);

		target.growCount = Math.ceil(
			(target.maxMoney - target.availableMoney) /
				target.availableMoney /
				target.growParam +
				(moneyThreshold - target.availableMoney) /
					target.availableMoney /
					target.growParam
		);
		if (
			target.growCount < 0 ||
			!target.growCount ||
			!isFinite(target.growCount)
		) {
			target.growCount = 1;
		}
		target.hackCount = Math.ceil(
			moneyThreshold /
				(target.availableMoney * target.growCount * target.growParam +
					1) /
				target.moneyHack /
				target.hackChance_
		);
		if (
			target.hackCount < 0 ||
			!target.hackCount ||
			!isFinite(target.hackCount)
		) {
			target.hackCount = 1;
		}
		target.weakenCount = Math.ceil(
			(target.security_ -
				target.minSecurity +
				target.growCount * secUpOnGrow +
				target.hackCount * secUpOnHack) /
				secDownOnWeaken
		);
		if (
			target.weakenCount < 0 ||
			!target.weakenCount ||
			!isFinite(target.weakenCount)
		) {
			target.weakenCount = 1;
		}

		target.time =
			target.weakenCount * target.weakenTime_ +
			target.growCount * target.growTime_ +
			target.hackCount * target.hackTime_;

		if (
			target.time &&
			target.time != Infinity &&
			target.time != -Infinity &&
			target.maxMoney != 0
		) {
			target.targetable = true;
		} else {
			target.targetable = false;
		}
		timeToMoney.push(target);
	}
	timeToMoney.sort((a, b) => {
		if (a.targetable == b.targetable) {
			if ((a.pids.length == 0) == (b.pids.length == 0)) {
				if (a.priority == b.priority) {
					return a.time - b.time;
				} else {
					return b.priority - a.priority;
				}
			} else {
				return (b.pids.length == 0) - (a.pids.length == 0);
			}
		} else {
			return b.targetable - a.targetable;
		}
	});
	return timeToMoney;
}

export async function taskDispatcher(
	ns,
	targets,
	ramAvailable,
	hackRam,
	weakenRam,
	growRam
) {
	let index = 0;
	let length = targets.length;
	let flagError = false;

	if (length <= 0 || targets[0].targetable == false) {
		return [];
	}

	let weakenCount = 0;
	let growCount = 0;
	let hackCount = 0;

	if (index < length) {
		weakenCount = targets[index].weakenCount;
		growCount = targets[index].growCount;
		hackCount = targets[index].hackCount;
	}
	while (ramAvailable.length > 0 && !flagError) {
		if (weakenCount > 0 && ramAvailable[0].ram >= weakenRam) {
			let threads = Math.min(
				Math.floor(ramAvailable[0].ram / weakenRam),
				weakenCount
			);
			ramAvailable[0].ram -= weakenRam * threads;
			weakenCount -= threads;
			targets[index].pids.push(
				ns.exec(
					'/scripts/weaken.js',
					ramAvailable[0].name,
					threads,
					targets[index].name
				)
			);
		}

		if (growCount > 0 && ramAvailable[0].ram >= growRam) {
			let threads = Math.min(
				Math.floor(ramAvailable[0].ram / growRam),
				growCount
			);
			ramAvailable[0].ram -= growRam * threads;
			growCount -= threads;
			targets[index].pids.push(
				ns.exec(
					'/scripts/grow.js',
					ramAvailable[0].name,
					threads,
					targets[index].name
				)
			);
		}

		if (hackCount > 0 && ramAvailable[0].ram >= hackRam) {
			let threads = Math.min(
				Math.floor(ramAvailable[0].ram / hackRam),
				hackCount
			);
			ramAvailable[0].ram -= hackRam * threads;
			hackCount -= threads;
			targets[index].pids.push(
				ns.exec(
					'/scripts/hack.js',
					ramAvailable[0].name,
					threads,
					targets[index].name
				)
			);
		}

		if (weakenCount <= 0 && growCount <= 0 && hackCount <= 0) {
			index = (index + 1) % length;
			while (!targets[index].targetable && !flagError) {
				if (index == 0) {
					flagError = true;
				}
				index = (index + 1) % length;
			}
			weakenCount = targets[index].weakenCount;
			growCount = targets[index].growCount;
			hackCount = targets[index].hackCount;
		}

		if (
			(ramAvailable[0].ram < weakenRam || weakenCount <= 0) &&
			(ramAvailable[0].ram < growRam || growCount <= 0) &&
			(ramAvailable[0].ram < hackRam || hackCount <= 0)
		) {
			ramAvailable.shift();
		}
	}
}
