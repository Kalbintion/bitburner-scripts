import {COLORS} from "colors";

const FLAGS = [['size', 16]];

/** @param {NS} ns */
export async function main(ns) {
  let serverList = ns.getPurchasedServers();
  let pMoney = ns.getServerMoneyAvailable("home");
  
  const flags = ns.flags(FLAGS);

  for(var i = 0; i < serverList.length; ++i) {
    let hostname = serverList[i];
    let uCost = ns.getPurchasedServerUpgradeCost(hostname, 16);
    let maxRam = ns.getServerMaxRam(hostname);

    if(uCost < pMoney && maxRam < flags.size) {
      ns.tprintf(COLORS.BRIGHT_YELLOW + "Upgraded server %s to %s", hostname, ns.formatRam(flags.size));
      ns.upgradePurchasedServer(hostname, flags.size);
      pMoney = ns.getServerMoneyAvailable("home");
    } else if(maxRam >= flags.size) {
      ns.tprintf(COLORS.YELLOW + "Skipped server %s, already upgraded", hostname);
    } else {
      ns.tprintf(COLORS.BRIGHT_RED + "Failed to upgrade %s, costs: %s, have: %s", hostname, uCost, pMoney);
      return;
    }
  }
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}
