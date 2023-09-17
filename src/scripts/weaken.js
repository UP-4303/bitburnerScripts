/** @param {NS} ns */
export async function main(ns) {
	let target;
	if (ns.args.length > 0){
		target = ns.args[0];
	}else{
		target = "n00dles";
	}
	ns.print('WEAKENING '+target);
	await ns.weaken(target);
}