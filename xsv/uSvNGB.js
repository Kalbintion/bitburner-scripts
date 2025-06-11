import {COLORS} from "colors";

const FLAGS = [['size', 16], ['power', 0]];

/** @param {NS} ns */
export async function main(ns) {
  let serverList = ns.getPurchasedServers();
  let pMoney = ns.getServerMoneyAvailable("home");
  
  const flags = ns.flags(FLAGS);

  if(flags.power > 20 || flags.power < 0) {
    ns.tprintf(COLORS.BRIGHT_RED + "ERROR: Cannot upgrade servers over 2^20 or below 2^0. Expected: [0, 20] Got: %s", flags.power);
    ns.exit();
  }

  if(flags.power > 0) {
    flags.size = Math.pow(2, flags.power);
  }

  if(flags.size > 0 && !((flags.size & (flags.size - 1)) === 0)) {
    let nPow = Math.round(Math.log2(flags.size));
    if(nPow > 20) nPow = 20;
    let nVal = Math.pow(2, nPow);
    ns.tprintf(COLORS.BRIGHT_RED + "ERROR: Cannot upgrade servers to non-power of two value. Got: %s, Nearest: %s", flags.size, nVal);
    ns.exit();
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