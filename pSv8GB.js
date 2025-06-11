/** @param {NS} ns */
export async function main(ns) {
    const ram = 8;
  
    let i = 0;
  
    let serverLimit = ns.getPurchasedServerLimit();
    let ownedServers = ns.getPurchasedServers().length;
  
    ns.tprint("Current Owned Servers: " + ownedServers + " / " + serverLimit);
  
    if(serverLimit == ownedServers) {
      return;
    }
  
    while (i < serverLimit) {
      if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
        let hostname = ns.purchaseServer("pserv-" + i, ram);
        ns.scp(["colors.js", "servers.js", "pserv.js"], hostname);
        ns.exec("pserv.js", hostname, 3);
        ++i;
      }
  
      await ns.sleep(1000);
    }
  }