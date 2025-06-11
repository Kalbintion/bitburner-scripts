import { COLORS } from "colors";
import { serverList } from "servers.js";

const FLAGS = [['silent', false]];

/** @param {NS} ns */
export async function main(ns) {
  // Load default flags
  const flags = ns.flags(FLAGS);
  
  const servMax = serverList.length - 1;
  const servMin = 0;

  var cTar = ns.args[0] || "";
  var cTarInfo = "";

  if (cTar !== "") {
    let cFound = false;
    for (var i = 0; i < serverList.length; i++) {
      let tSvInfo = serverList[i];
      let tSvName = tSvInfo[0];
      if (tSvName == cTar) {
        cTarInfo = tSvInfo;
        cFound = true;
        break;
      }
    }

    if (!cFound) {
      ns.tprint("ERROR: Target hostname info not found!");
      cTar = "";
      return;
    }
  }

  while (true) {
    var targetInfo;
    if (cTar !== "") {
      targetInfo = cTarInfo;
    } else {
      targetInfo = serverList[Math.floor(Math.random() * (servMax - servMin + 1)) + servMin];
    }
    var target = targetInfo[0];
    var moneyThresh = targetInfo[4];
    var securityThresh = targetInfo[5];

    if (ns.hasRootAccess(target)) {
      ns.tprintf(COLORS.WHITE + "Server: %-15s, targeted" + COLORS.RESET, target);
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