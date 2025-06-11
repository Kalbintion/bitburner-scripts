import { COLORS } from "colors";
import { serverList } from "servers";

const FLAGS = [['silent', false]];

/** @param {NS} ns */
export async function main(ns) {
  // Load default flags
  const flags = ns.flags(FLAGS);
  
  const target = ns.args[0] || ns.getHostname();
  var moneyThresh, securityThresh;

  for (var i = 0; i < serverList.length; i++) {
    let servInfo = serverList[i];
    if (servInfo[0] == target) {
      moneyThresh = servInfo[4];
      securityThresh = servInfo[5];
    }
  }

  while (true) {
    if (ns.getServerSecurityLevel(target) > securityThresh) {
      let securityReduce = await ns.weaken(target);
      annMsgF(ns, flags, COLORS.BRIGHT_RED + "Server: %-15s, Security: %s", target, securityReduce.toFixed(5) + COLORS.RESET);
    } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
      let grownMoney = await ns.grow(target);
      annMsgF(ns, flags, COLORS.GREEN + "Server: %-15s, Grown: %s", target, grownMoney.toFixed(5) + COLORS.RESET);
    } else {
      let earnedMoney = await ns.hack(target);
      annMsgF(ns, flags, COLORS.BRIGHT_GREEN + "Server: %-15s, Earned: %s", target, earnedMoney.toFixed(5) + COLORS.RESET);
    }
  }
}

function logMsg(ns, flags, message) {
  if (!flags.silent) {
    ns.print(message);
  }
}

function logMsgF(ns, flags, format, ...args) {
  if (!flags.silent) {
    ns.printf(format, ...args);
  }
}

function annMsg(ns, flags, message) {
  if (!flags.silent) {
    ns.tprint(message);
  }
}

function annMsgF(ns, flags, format, ...args) {
  if (!flags.silent) {
    ns.tprintf(format, ...args);
  }
}