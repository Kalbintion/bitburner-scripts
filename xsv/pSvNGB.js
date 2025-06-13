import {COLORS} from "/util/colors.js";

const FLAGS = [['size', 8], ['power', 0], ['script', 'pserv.js']];

/** @param {NS} ns */
export async function main(ns) {
  const flags = ns.flags(FLAGS);

  if(flags.power > 20) {
    ns.tprintf(COLORS.BRIGHT_RED + "ERROR: Cannot buy servers over 2^20. Expected: [0, 20] Got: %s", flags.power);
    ns.exit();
  }

  if(flags.power > 0) {
    flags.size = Math.pow(2, flags.power);
  }

  let i = 0;

  let serverLimit = ns.getPurchasedServerLimit();
  let ownedServers = ns.getPurchasedServers().length;

  ns.tprintf(COLORS.WHITE + "Current Owned Servers: %s / %s", ownedServers, serverLimit);

  if(serverLimit == ownedServers) {
    return;
  }

  while (i < serverLimit) {
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(flags.size)) {
      let hostname = ns.purchaseServer("pserv-" + i, flags.size);
      ns.scp(["./util/colors.js", "servers.js", flags.script], hostname);
      ns.exec(flags.script, hostname, 3);
      ++i;
    }

    await ns.sleep(1000);
  }
}
  
/**
 * @param {AutocompleteData} data
 */
export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}