/** @param {NS} ns */
export async function main(ns) {
    var distServ = ns.getPurchasedServers()
    var playerServers = distServ.push('home');
    var serverChecked = [];
    var checkList = [];

    var servers1 = await ns.scan("home");
    for (var server in servers1) {
        if (!checkList.includes(servers1[server])) {
            checkList.push(servers1[server]);
        }
    }
    serverChecked.push("home");
    var flag = true;
    while (flag) {
        flag = false;
        for (var i = 0; i < checkList.length; i++) {
            var servers = await ns.scan(checkList[i]);
            if (!serverChecked.includes(checkList[i])) {
                serverChecked.push(checkList[i]);
            }
            for (var server in servers) {
                if (!checkList.includes(servers[server])) {
                    checkList.push(servers[server]);
                }
            }
        }
    }
    // remove player servers from serverChecked
    for (var server in playerServers) {
        for (var i = 0; i < serverChecked.length; i++) {
            if (serverChecked == playerServers[server]) {
                serverChecked.splice(i, 1);
                i--;
            }
        }
    }
    for (var server in serverChecked) {
        ns.print(serverChecked[server] + "\n");
        ns.tprint(serverChecked[server] + "\n");
    }
}