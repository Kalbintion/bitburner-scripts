import { COLORS } from "/util/colors.js";

/** @param {NS} ns */
export async function main(ns) {
  let reservedRAM = ns.args[0] || 64;
  let numThreads = ns.args[1] || 300;
  let delayBetween = ns.args[2] || 0;

  let spawnCount = 0;

  ns.kill("phome.js", "home");
  let homeRAM = ns.getServerMaxRam("home");
  let freeRAM = homeRAM - ns.getServerUsedRam("home");

  let pSize = ns.getScriptRam("phome.js", "home");
  let pSizeTotal = pSize * numThreads;

  ns.tprintf(COLORS.BRIGHT_BLACK + "Home RAM: " + COLORS.RESET + " %s, " + COLORS.BRIGHT_BLACK + "Free RAM: " + COLORS.RESET + "%s, " + COLORS.BRIGHT_BLACK + "Script Size: " + COLORS.RESET + "%s", homeRAM, freeRAM, pSize);
  while (freeRAM - pSizeTotal >= reservedRAM) {
    spawnCount++;
    ns.exec("phome.js", "home", numThreads);
    homeRAM = ns.getServerMaxRam("home");
    freeRAM = homeRAM - ns.getServerUsedRam("home");
    await ns.sleep(delayBetween);
  }

  ns.tprintf("Spawned %s phome.js instances.", spawnCount);
}