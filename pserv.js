import { COLORS } from "colors";
import { serverList } from "servers.js";

/** @param {NS} ns */
export async function main(ns) {
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
      ns.tprint(COLORS.WHITE + "INFO: Targeting server: " + target + COLORS.RESET);
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
  }
}
