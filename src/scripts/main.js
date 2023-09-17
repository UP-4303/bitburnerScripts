/** @param {NS} ns */
export async function main(ns) {
	let choices = [
		"0 : Start base scripts",
		"1 : Buy maxed servers and deploy files",
		"2 : Deploy update",
		"3 : Ultra-scan",
		"4 : Homogenize purchased servers",
		"5 : Delete all purchased servers"
	]

	let menuChoice = await ns.prompt("Tell us your command", { "type": "select", "choices": choices });
	let indexChoice = choices.indexOf(menuChoice);

	switch (indexChoice) {
		case 0:
			ns.run('/scripts/watcher.js');
			ns.run('/scripts/rem.js')
			break;
		case 1:
			ns.run('/scripts/buyServersAndDeploy.js')
			break;
		case 2:
			ns.run('/scripts/deployUpdate.js');
			break;
		case 3:
			ns.run('/scripts/us.js');
			break;
		case 4:
			ns.run('/scripts/homogenizePurchasedServers.js');
			break;
		case 5:
			ns.run('/scripts/deletePurchasedServers.js');
			break;
	}
}