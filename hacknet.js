import { COLORS } from "colors";

const FLAGS = [['maxServers', 18], ['numLevels', 10], ['numRam', 1], ['numCores', 1], ['sleepTime', 1000]];

/**
 * Manages the hacknet node upgrading & buying process
 * @param {Number} maxServers   Maximum number of nodes to buy
 * @param {Number} numLevels    How many levels to buy each attempt
 * @param {Number} numRam       How many ram levels to buy each attempt
 * @param {Number} numCores     How many core levels to buy each attempt
 * @param {Number} sleepTime    Time between script checking to buy
 */
export async function main(ns) {
  const flags = ns.flags(FLAGS);

  let numOfServers = ns.hacknet.numNodes();

  while (true) {
    let playerMoney = ns.getServerMoneyAvailable("home");

    for (var i = 0; i < numOfServers; i++) {
      let nodeInfo = ns.hacknet.getNodeStats(i);

      let levelCost = ns.hacknet.getLevelUpgradeCost(i, 10);
      let ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
      let coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);

      if (levelCost < ramCost && levelCost < coreCost && levelCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying 10 levels for hacknet node " + i + COLORS.RESET);
        ns.hacknet.upgradeLevel(i, flags.numLevels);
        playerMoney = ns.getServerMoneyAvailable("home");
      } else if (ramCost < levelCost && ramCost < coreCost && ramCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying ram for hacknet node " + i + COLORS.RESET);
        ns.hacknet.upgradeRam(i, flags.numRam);
        playerMoney = ns.getServerMoneyAvailable("home");
      } else if (coreCost < ramCost && coreCost < levelCost && coreCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying core upgrade for hacknet node " + i + COLORS.RESET);
        ns.hacknet.upgradeCore(i, flags.numCores);
        playerMoney = ns.getServerMoneyAvailable("home");
      }
    }

    let nodeCost = ns.hacknet.getPurchaseNodeCost();

    if (nodeCost < playerMoney && numOfServers <= flags.maxServers) {
      let newSvIdx = hn.purchaseNode();
      ns.tprint(COLORS.BRIGHT_CYAN + "Bought new hacknet node: " + newSvIdx);
      numOfServers = ns.hacknet.numNodes();
    }

    await ns.sleep(flags.sleepTime);
  }
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}
