/** @param {NS} ns */
export async function main(ns) {
  let delayBetween = ns.args[0] || 0;

  ns.kill("phome.js", "home");
  let homeRAM = ns.getServerMaxRam("home");
  let freeRAM = homeRAM - ns.getServerUsedRam("home");

  let pSize = ns.getScriptRam("phome.js", "home");
  let pSizeTotal = pSize * 300;

  ns.tprintf("Home RAM: %s, Free RAM: %s, Script Size: %s", homeRAM, freeRAM, pSize);
  while (freeRAM - pSizeTotal >= 64) {
    ns.tprint("Spawned phome.js");
    ns.exec("phome.js", "home", 300);
    homeRAM = ns.getServerMaxRam("home");
    freeRAM = homeRAM - ns.getServerUsedRam("home");
    await ns.sleep(delayBetween);
  }
}
