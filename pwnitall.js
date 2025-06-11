import { serverList } from "servers.js";
import { COLORS } from "colors.js";

const FLAGS = [['silent', false], ['sleepTime', 1000]];

/** @remarks RAM cost 2.1GB
 *  @param {NS} ns
 **/
export async function main(ns) {
  const flags = ns.flags(FLAGS);

  let pwnItAll = false;
  while (!pwnItAll) {
    pwnItAll = true;

    let maxSecurityLevel = 0;
    let crackApps = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
    for (let i = 0; i < crackApps.length; ++i) {
      if (ns.fileExists(crackApps[i])) {
        maxSecurityLevel++;
      }
    }

    let plHack = ns.getHackingLevel();

    for (var i = 0; i < serverList.length; ++i) {
      let svInfo = serverList[i],
        svName = svInfo[0],
        svSecurity = svInfo[2],
        svHack = svInfo[3],
        svRoot = ns.hasRootAccess(svName),
        nPorts = 0;

      // Require not having root, all the tools available, and player hack level above server hack requirement
      if (!svRoot && maxSecurityLevel >= svSecurity && plHack >= svHack) {
        // We should have all we need to hack
        if (ns.fileExists("BruteSSH.exe")) {
          ns.brutessh(svName);
          nPorts++;
          logMsg(ns, flags, COLORS.YELLOW + "BruteSSH @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("FTPCrack.exe")) {
          ns.ftpcrack(svName);
          nPorts++;
          logMsg(ns, flags, COLORS.YELLOW + "FTPCrack @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("relaySMTP.exe")) {
          ns.relaysmtp(svName);
          nPorts++;
          logMsg(ns, flags, COLORS.YELLOW + "relaySMTP @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("HTTPWorm.exe")) {
          ns.httpworm(svName);
          nPorts++;
          logMsg(ns, flags, COLORS.YELLOW + "HTTPWorm @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("SQLInject.exe")) {
          ns.sqlinject(svName);
          nPorts++;
          logMsg(ns, flags, COLORS.YELLOW + "SQLInject @ " + svName + COLORS.RESET);
        }

        if (nPorts >= svSecurity) {
          ns.nuke(svName);
          logMsg(ns, flags, COLORS.BRIGHT_GREEN + "SUCCESS @ " + svName + COLORS.RESET);
        } else {
          pwnItAll = false;
          logMsg(ns, flags, COLORS.BRIGHT_RED + "FAILED @ " + svName + COLORS.RESET);
        }
      } else if (!svRoot && (maxSecurityLevel < svSecurity || plHack < svHack)) {
        pwnItAll = false;
        logMsg(ns, flags, COLORS.BRIGHT_RED + "FAILED @ " + svName + COLORS.RESET);
      }
    }
    await ns.sleep(5000);
  }
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}

function logMsg(ns, flags, message) {
  if(!flags.silent) {
    ns.print(message);
  }
}