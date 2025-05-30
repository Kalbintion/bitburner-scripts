import { COLORS } from "colors";
import { serverList } from "servers";

/** @param {NS} ns */
export async function main(ns) {
  const target = ns.args[0] || ns.getHostname();
  var moneyThresh, securityThresh;

  for(var i = 0; i < serverList.length; i++) {
    let servInfo = serverList[i];
    if(servInfo[0] == target) {
      moneyThresh = servInfo[4];
      securityThresh = servInfo[5];
    }
  }

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      let securityReduce = await ns.weaken(target);
      ns.tprint(COLORS.BRIGHT_RED + "INFO: Server: " + target + ", Security: " + securityReduce + COLORS.RESET);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      let grownMoney = await ns.grow(target);
      ns.tprint(COLORS.GREEN + "INFO: Server: " + target + ", Grown: " + grownMoney + COLORS.RESET);
    } else {
      let earnedMoney = await ns.hack(target);
      ns.tprint(COLORS.BRIGHT_GREEN + "INFO: Server: " + target + ", Earned: " + earnedMoney + COLORS.RESET);
    }
  }

  ns.print()
}
