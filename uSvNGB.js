import {COLORS} from "colors";

const FLAGS = [['size', 16], ['power', 0]];

/** @param {NS} ns */
export async function main(ns) {
  let serverList = ns.getPurchasedServers();
  let pMoney = ns.getServerMoneyAvailable("home");
  
  const flags = ns.flags(FLAGS);
  if(flags.power > 0) {
    flags.size = Math.pow(2, flags.power);
  }

  for(var i = 0; i < serverList.length; ++i) {
    let hostname = serverList[i];
    let uCost = ns.getPurchasedServerUpgradeCost(hostname, flags.size);
    let maxRam = ns.getServerMaxRam(hostname);

    if(uCost > -1 && uCost < pMoney && maxRam < flags.size) {
      ns.tprintf(COLORS.BRIGHT_YELLOW + "Upgraded server %s to %s [Cost: %s, Have: %s]", hostname, ns.formatRam(flags.size), ns.formatNumber(uCost), ns.formatNumber(pMoney));
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
