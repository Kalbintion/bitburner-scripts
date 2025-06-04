/** @param {NS} ns */
export async function main(ns) {
  let reservedRAM = ns.args[0] || 64;
  let numThreads = ns.args[1] || 300;
  let delayBetween = ns.args[2] || 0;

  ns.kill("phome.js", "home");
  let homeRAM = ns.getServerMaxRam("home");
  let freeRAM = homeRAM - ns.getServerUsedRam("home");

  let pSize = ns.getScriptRam("phome.js", "home");
  let pSizeTotal = pSize * numThreads;

  ns.tprintf("Home RAM: %s, Free RAM: %s, Script Size: %s", homeRAM, freeRAM, pSize);
  while (freeRAM - pSizeTotal >= reservedRAM) {
    ns.tprint("Spawned phome.js");
    ns.exec("phome.js", "home", numThreads);
    homeRAM = ns.getServerMaxRam("home");
    freeRAM = homeRAM - ns.getServerUsedRam("home");
    await ns.sleep(delayBetween);
  }
}
