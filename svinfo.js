import { COLORS, COLOR_BUILDER } from "/util/colors.js";

/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0];

  if (!ns.serverExists(target)) {
    ns.tprint(COLOR_BUILDER.REQUEST("red", "", true, false, true) + "ERROR:" + COLORS.RESET + " Provided server, " + target + " does not exist");
    return;
  }

  let server = ns.getServer(target);
  let clrField = COLOR_BUILDER.REQUEST("green", "black", true, false, false);
  let clrReset = COLORS.RESET;

  const svRamCur = server.ramUsed,
    svRamMax = server.maxRam,
    svMoneyCur = server.moneyAvailable,
    svMoneyMax = server.moneyMax,
    svSecMin = server.minDifficulty,
    svSecCur = server.hackDifficulty,
    svSecBas = server.baseDifficulty,
    svGrowth = server.serverGrowth,
    hAnalyze = ns.hackAnalyze(target),
    hPerAnalyze = ns.hackAnalyzeChance(target) * 100;

  ns.tprint(`
${target}:
   ${clrField}RAM${clrReset}       : ${svRamCur} / ${svRamMax} (${svRamCur / svRamMax * 100}%)
   ${clrField}Money${clrReset}     : ${ns.formatNumber(svMoneyCur, 3)} / ${ns.formatNumber(svMoneyMax, 3)} (${(svMoneyCur / svMoneyMax * 100).toFixed(2)}%)
   ${clrField}Security${clrReset}  : ${svSecMin.toFixed(2)} / ${svSecCur.toFixed(2)} | ${svSecBas}
   ${clrField}Growth${clrReset}    : ${svGrowth}
   ${clrField}Hack Time${clrReset} : ${ns.tFormat(ns.getHackTime(target))}
   ${clrField}Grow Time${clrReset} : ${ns.tFormat(ns.getGrowTime(target))}
   ${clrField}Weak Time${clrReset} : ${ns.tFormat(ns.getWeakenTime(target))}
   ${clrField}Grow x2${clrReset}   : ${(ns.growthAnalyze(target, 2)).toFixed(2)} threads
   ${clrField}Grow x3${clrReset}   : ${(ns.growthAnalyze(target, 3)).toFixed(2)} threads
   ${clrField}Grow x4${clrReset}   : ${(ns.growthAnalyze(target, 4)).toFixed(2)} threads
   ${clrField}Hack 10%${clrReset}  : ${(.10 / hAnalyze).toFixed(2)} threads
   ${clrField}Hack 25%${clrReset}  : ${(.25 / hAnalyze).toFixed(2)} threads
   ${clrField}Hack 50%${clrReset}  : ${(.50 / hAnalyze).toFixed(2)} threads
   ${clrField}Hack %${clrReset}    : ${(hPerAnalyze).toFixed(2)}% 
  `);
}