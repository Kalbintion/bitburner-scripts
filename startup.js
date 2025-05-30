import { serverList } from "servers.js";
import { COLORS } from "colors.js";

/** @param {NS} ns */
export async function main(ns) {
  let scriptName = ns.args[0] || "hack-template.js";
  let targetArgs = ns.args[1] || "";

  const scriptCost = ns.getScriptRam(scriptName, "home");
  const pHack = ns.getHackingLevel();

  let maxSecurityLevel = 0;
  let crackApps = ["BruteSSH.exe", "FTPCrack.exe", "relaySMTP.exe", "HTTPWorm.exe", "SQLInject.exe"];
  for (let i = 0; i < crackApps.length; ++i) {
    if (ns.fileExists(crackApps[i])) {
      maxSecurityLevel++;
    }
  }

  const svFormat = "%-32s | %17s | %15s | %15s | %17s | %18s | %17s | %-15s | %-15s"
  ns.tprintf(svFormat,
    COLORS.MAGENTA + "SERVER" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "RAM" + COLORS.RESET, 
    COLORS.BRIGHT_WHITE + "SEC" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "HACK" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "MAX $" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "MIN SEC" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "GROWTH" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "ROOTED" + COLORS.RESET,
    COLORS.BRIGHT_WHITE + "STATUS" + COLORS.RESET);

  for (let i = 0; i < serverList.length; ++i) {
    var servInfo = serverList[i],
      servName = servInfo[0],
      servRam = servInfo[1],
      servSecurity = servInfo[2],
      servHack = servInfo[3],
      servMaxMoney = servInfo[4],
      servMinSec = servInfo[5],
      servGrowth = servInfo[6],
      servStatus = "Unknown",
      rootAccess = ns.hasRootAccess(servName);

    if (!rootAccess && maxSecurityLevel >= servSecurity) {
      whileBlock: {
        while (servSecurity > 0) {
          switch (servSecurity) {
            case 1:
              if (ns.fileExists("BruteSSH.exe")) {
                await ns.brutessh(servName);
                ns.tprint(COLORS.CYAN + "Executing BruteSSH on " + servName);
              } else {
                ns.tprint(COLORS.RED + "Failed to BruteSSH. File missing.");
                break whileBlock;
              }
              break;
            case 2:
              if (ns.fileExists("FTPCrack.exe")) {
                await ns.ftpcrack(servName);
                ns.tprint(COLORS.CYAN + "Executing FTPCrack on " + servName);
              } else {
                ns.tprint(COLORS.RED + "Failed to FTPCrack. File missing.");
                break whileBlock;
              }
              break;
            case 3:
              if (ns.fileExists("relaySMTP.exe")) {
                await ns.relaysmtp(servName);
                ns.tprint(COLORS.CYAN + "Executing relaySMTP on " + servName);
              } else {
                ns.tprint(COLORS.RED + "Failed to relaySMTP. File missing");
                break;
              }
              break;
            case 4:
              if (ns.fileExists("HTTPWorm.exe")) {
                await ns.httpworm(servName);
                ns.tprint(COLORS.CYAN + "Executing HTTPWorm on " + servName);
              } else {
                ns.tprint(COLORS.RED + "Failed to HTTPWorm. File missing");
                break whileBlock;
              }
              break;
            case 5:
              if (ns.fileExists("SQLInject.exe")) {
                await ns.sqlinject(servName);
                ns.tprint(COLORS.CYAN + "Executing SQLInject on " + servName);
              } else {
                ns.tprint(COLORS.RED + "Failed to SQLInject. File missing");
                break whileBlock;
              }
              break;
          }
          servSecurity--;
        }
      }
    }

    if (servSecurity == 0 || rootAccess) {
      ns.scp(["colors.js", "servers.js", scriptName], servName);
      if (!rootAccess && pHack >= servHack) {
        servStatus = COLORS.GREEN + "NUKED" + COLORS.RESET;
        //ns.tprint(COLORS.GREEN + "Nuking server: " + servName);
        ns.nuke(servName);
      } else if(!rootAccess && pHack < servHack) {
        servStatus = COLORS.YELLOW + "WARN [" + pHack + "/" + servHack + "]" + COLORS.RESET;
        //ns.tprint(COLORS.YELLOW + "Could not hack server: " + servName + ", requires lvl: " + servHack + ", has: " + pHack);
      }
      
      if(rootAccess) {
        ns.killall(servName);
        ns.exec(scriptName, servName, Math.floor(servRam / scriptCost), targetArgs);
        servStatus = COLORS.BRIGHT_BLACK + "RESET" + COLORS.RESET;
        //ns.tprint(COLORS.BRIGHT_BLACK + "Reset server: " + servName);
      }
    } else if(!rootAccess && servSecurity > 0) {
      servStatus = COLORS.BRIGHT_RED + "FAILED" + COLORS.RESET;
      //ns.tprint(COLORS.RED + "Failed to nuke: " + servName);
    } else {
      servStatus = COLORS.BRIGHT_YELLOW + "SKIPPED" + COLORS.RESET;
      //ns.tprint(COLORS.BRIGHT_BLACK + "Skipped server: " + servName);
    }

    ns.tprintf(svFormat,
      COLORS.MAGENTA + servName + COLORS.RESET,
      COLORS.BRIGHT_WHITE + ns.formatRam(servRam, 0) + COLORS.RESET,
      COLORS.BRIGHT_WHITE + ns.formatNumber(servSecurity, 0) + COLORS.RESET,
      COLORS.BRIGHT_WHITE + ns.formatNumber(servHack, 0) + COLORS.RESET,
      COLORS.BRIGHT_WHITE + ns.formatNumber(servMaxMoney, 0) + COLORS.RESET,
      COLORS.BRIGHT_WHITE + servMinSec + COLORS.RESET,
      COLORS.BRIGHT_WHITE + ns.formatNumber(servGrowth, 0) + COLORS.RESET,
      COLORS.YELLOW + rootAccess + COLORS.RESET,
      servStatus
    );
  }
}
