import { Scanner } from "scanAll.js"
/** @param {NS} ns */ 
export async function main(ns) {
	let serverList = await Scanner(ns)
	ns.tprint(serverList)
}