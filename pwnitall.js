import { serverList } from "servers.js";
import { COLORS } from "colors.js";

/** @remarks RAM cost 2.1GB
 *  @param {NS} ns
 **/
export async function main(ns) {

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
        svRam = svInfo[1],
        svSecurity = svInfo[2],
        svHack = svInfo[3],
        svMaxMoney = svInfo[4],
        svMinSec = svInfo[5],
        svGrowth = svInfo[6],
        svRoot = ns.hasRootAccess(svName),
        nPorts = 0;

      // Require not having root, all the tools available, and player hack level above server hack requirement
      if (!svRoot && maxSecurityLevel >= svSecurity && plHack >= svHack) {
        // We should have all we need to hack
        if (ns.fileExists("BruteSSH.exe")) {
          ns.brutessh(svName); nPorts++; ns.print(COLORS.YELLOW + "BruteSSH @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("FTPCrack.exe")) {
          ns.ftpcrack(svName); nPorts++; ns.print(COLORS.YELLOW + "FTPCrack @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("relaySMTP.exe")) {
          ns.relaysmtp(svName); nPorts++; ns.print(COLORS.YELLOW + "relaySMTP @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("HTTPWorm.exe")) {
          ns.httpworm(svName); nPorts++; ns.print(COLORS.YELLOW + "HTTPWorm @ " + svName + COLORS.RESET);
        }
        if (ns.fileExists("SQLInject.exe")) {
          ns.sqlinject(svName); nPorts++; ns.print(COLORS.YELLOW + "SQLInject @ " + svName + COLORS.RESET);
        }

        if (nPorts >= svSecurity) {
          ns.nuke(svName);
          ns.print(COLORS.BRIGHT_GREEN + "SUCCESS @ " + svName + COLORS.RESET);
        } else {
          pwnItAll = false;
          ns.print(COLORS.BRIGHT_RED + "FAILED @ " + svName + COLORS.RESET);
        }
      } else {
        pwnItAll = false;
        ns.print(COLORS.BRIGHT_RED + "FAILED @ " + svName + COLORS.RESET);
      }
    }
    await ns.sleep(5000);
  }
}
