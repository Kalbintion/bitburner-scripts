import { COLORS } from "colors";

/** @param {NS} ns */
export async function main(ns) {
  let hn = ns.hacknet;
  let numOfServers = hn.numNodes();

  while (true) {
    let playerMoney = ns.getServerMoneyAvailable("home");

    for (var i = 0; i < numOfServers; i++) {
      let nodeInfo = hn.getNodeStats(i);

      let levelCost = hn.getLevelUpgradeCost(i, 10);
      let ramCost = hn.getRamUpgradeCost(i, 1);
      let coreCost = hn.getCoreUpgradeCost(i, 1);

      if (levelCost < ramCost && levelCost < coreCost && levelCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying 10 levels for hacknet node " + i + COLORS.RESET);
        hn.upgradeLevel(i, 10);
        playerMoney = ns.getServerMoneyAvailable("home");
      } else if (ramCost < levelCost && ramCost < coreCost && ramCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying ram for hacknet node " + i + COLORS.RESET);
        hn.upgradeRam(i, 1);
        playerMoney = ns.getServerMoneyAvailable("home");
      } else if (coreCost < ramCost && coreCost < levelCost && coreCost < playerMoney) {
        ns.tprint(COLORS.BRIGHT_CYAN + "Buying core upgrade for hacknet node " + i + COLORS.RESET);
        hn.upgradeCore(i, 1);
        playerMoney = ns.getServerMoneyAvailable("home");
      }
    }

    let nodeCost = hn.getPurchaseNodeCost();

    if (nodeCost < playerMoney) {
      let newSvIdx = hn.purchaseNode();
      ns.tprint(COLORS.BRIGHT_CYAN + "Bought new hacknet node: " + newSvIdx);
      numOfServers = hn.numNodes();
    }

    await ns.sleep(1000);
  }
}
