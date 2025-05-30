import { COLORS } from "colors";

/** @param {NS} ns */
export async function main(ns) {
  var serverList = ns.getPurchasedServers();
  let scriptName = ns.args[0] || "pserv.js";

  for (var i = 0; i < serverList.length; ++i) {
    const servName = serverList[i];

    ns.killall(servName);
    ns.scp(["colors.js", "servers.js", scriptName], servName);
    ns.exec(scriptName, servName, Math.floor(ns.getServerMaxRam(servName) / ns.getScriptRam(scriptName)));
    ns.tprint(COLORS.WHITE + "INFO: Setup server: " + servName + COLORS.RESET);
  }
}
