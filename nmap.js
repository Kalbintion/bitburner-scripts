/** @param {NS} ns */
export async function main(ns) {
  let servers = ["home"];
  
  if(ns.fileExists("servers.js")) {
    ns.clear("servers.js");
  }

  ns.write("servers.js", "export const serverList = [\r\n");
  for (var i = 0; i < servers.length; ++i) {
    let hostname = servers[i],
      maxRam = ns.getServerMaxRam(hostname),
      numPorts = ns.getServerNumPortsRequired(hostname),
      hackLvl = ns.getServerRequiredHackingLevel(hostname),
      maxMoney = ns.getServerMaxMoney(hostname),
      minSecu = ns.getServerMinSecurityLevel(hostname),
      growth = ns.getServerGrowth(hostname);

    if ((!hostname.startsWith("home") && !hostname.startsWith("pserv-"))
      && maxRam > 0 && maxMoney > 0) {

      ns.write("servers.js", "[\"" +
        hostname + "\"," +
        maxRam + "," +
        numPorts + "," +
        hackLvl + "," +
        maxMoney + "," +
        minSecu + "," +
        growth + "],\r\n"
      );
    }

    var newScan = ns.scan(hostname);
    for (var j = 0; j < newScan.length; j++) {
      if (servers.indexOf(newScan[j]) == -1) {
        servers.push(newScan[j]);
      }
    }
  }

  ns.write("servers.js", "];");
}