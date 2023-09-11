export async function main(ns) {
    let ram = 8
    let initserv = ns.getPurchasedServers().length
    let num = ns.args[0]
    if (num == undefined) {
        while(ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
            let servs = ns.getPurchasedServers()
            let id = servs.length
            let servName = "Serv_"+id
            ns.purchaseServer(servName, ram)
            ns.scp("hack.js.js", servName)
        }
        ns.tprint((ns.getPurchasedServers().length - initserv)+" serveurs ont été acheté")
    } else {
        for(let i = 0; i < num; i++) {
            let servs_ = ns.getPurchasedServers()
            let id_ = servs_.length
            let servName = "Serv_"+id_
            ns.purchaseServer(servName, ram)
            ns.scp("hack.js", servName)
        }
        ns.tprint(num+" serveurs ont été acheté")
    }
    ns.tprint("on possède "+ns.getPurchasedServers().length+"/25 serveurs")
}