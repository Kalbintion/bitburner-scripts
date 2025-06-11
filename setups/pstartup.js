import { COLORS } from "/util/colors.js";

/** @param {NS} ns */
export async function main(ns) {
  var serverList = ns.getPurchasedServers();
  let scriptName = ns.args[0] || "pserv.js";
  let target = ns.args[1] || "";
  let delayBetween = ns.args[2] || 0;

  for (var i = 0; i < serverList.length; ++i) {
    const servName = serverList[i];

    ns.killall(servName);
    ns.scp(["/util/colors.js", "/servers.js", scriptName], servName);
    ns.exec(scriptName, servName, Math.floor(ns.getServerMaxRam(servName) / ns.getScriptRam(scriptName)), target);
    ns.tprintf("%s", COLORS.WHITE + "Setup server: " + servName + COLORS.RESET);
    await ns.sleep(delayBetween);
  }
}