import {COLORS} from "/util/colors.js";

/** @param {NS} ns */
export async function main(ns) {
  let serverList = ns.getPurchasedServers();
  let pMoney = ns.getServerMoneyAvailable("home");

  for(var i = 0; i < serverList.length; ++i) {
    let hostname = serverList[i];
    let uCost = ns.getPurchasedServerUpgradeCost(hostname, 16);
    let maxRam = ns.getServerMaxRam(hostname);

    if(uCost < pMoney && maxRam == 8) {
      ns.tprint(COLORS.BRIGHT_YELLOW + "Upgraded server " + hostname + " to 16GB");
      ns.upgradePurchasedServer(hostname, 16);
      pMoney = ns.getServerMoneyAvailable("home");
    } else if(maxRam > 8) {
      ns.tprint(COLORS.YELLOW + "Skipped server " + hostname + ", already upgraded.");
    } else {
      ns.tprint(COLORS.BRIGHT_RED + "Failed to upgrade " + hostname + ", costs: " + uCost + ", have: " + pMoney);
      return;
    }
  }
}