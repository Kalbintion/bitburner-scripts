import { COLORS } from "colors";

const FLAGS = [['maxServers', Number.MAX_SAFE_INTEGER], ['numLevels', 10], ['numRam', 1], ['numCores', 1], ['sleepTime', 1000], ['maxLevels', Number.MAX_SAFE_INTEGER]];

/**
 * Manages the hacknet node upgrading & buying process
 * @param {Number} maxServers   Maximum number of nodes to buy
 * @param {Number} numLevels    How many levels to buy each attempt
 * @param {Number} numRam       How many ram levels to buy each attempt
 * @param {Number} numCores     How many core levels to buy each attempt
 * @param {Number} sleepTime    Time between script checking to buy
 * @param {Number} maxLevels    Maximum number of levels to purchase up to
 */
export async function main(ns) {
  // Load default flags
  const flags = ns.flags(FLAGS);

  // Update flags based on args, if available
  if(ns.args.join(" ").indexOf("--") == -1 && ns.args.length > 0) {
    flags.maxServers = ns.args[0] || flags.maxServers;
    flags.numLevels = ns.args[1] || flags.numLevels;
    flags.numRam = ns.args[2] || flags.numRam;
    flags.numCores = ns.args[3] || flags.numCores;
    flags.sleepTime = ns.args[4] || flags.sleepTime;
    flags.maxLevels = ns.args[5] || flags.maxLevels;
  }

  ns.tprint("=== HACKNET SETTINGS ===");
  ns.tprint("Max Servers: " + flags.maxServers);
  ns.tprint("# Levels: " + flags.numLevels);
  ns.tprint("# Ram: " + flags.numRam);
  ns.tprint("# Cores: " + flags.numCores);
  ns.tprint("Sleep: " + flags.sleepTime);
  ns.tprint("Max Level: " + flags.maxLevels);

  // Get number of current servers
  let numOfServers = ns.hacknet.numNodes();

  while (true) {
    // Get current player money
    let playerMoney = ns.getServerMoneyAvailable("home");

    let costs = {
      level: Number.MAX_SAFE_INTEGER,
      ram: Number.MAX_SAFE_INTEGER,
      core: Number.MAX_SAFE_INTEGER,
      node: ns.hacknet.getPurchaseNodeCost()
    };

    if (numOfServers > flags.maxServers) {
      costs.node = Number.MAX_SAFE_INTEGER;
    }

    let indexes = {level: 0, ram: 0, core: 0}

    // Loop through each owned server
    for (var i = 0; i < numOfServers; ++i) {
      let levelCost = ns.hacknet.getLevelUpgradeCost(i, flags.numLevels);
      let ramCost = ns.hacknet.getRamUpgradeCost(i, flags.numRam);
      let coreCost = ns.hacknet.getCoreUpgradeCost(i, flags.numCores);

      if (levelCost < costs.level) {
        costs.level = levelCost; indexes.level = i;
      }
      if (ramCost < costs.ram) {
        costs.ram = ramCost; indexes.ram = i;
      }
      if (coreCost < costs.core) {
        costs.core = coreCost; indexes.core = i;
      }
    }

    // Find out which is cheapest
    const [cheapestType, cheapestValue] = Object.entries(costs)
      .reduce((minEntry, currentEntry) => currentEntry[1] < minEntry[1] ? currentEntry : minEntry);

    // Buy cheapest option, if we have the money for it
    if (cheapestValue <= playerMoney) {
      switch (cheapestType) {
        case 'level':
          ns.tprint(COLORS.BRIGHT_CYAN + "Buying " + flags.numLevels + " levels for hacknet node " + indexes.level + COLORS.RESET);
          ns.hacknet.upgradeLevel(indexes.level, flags.numLevels);
          break;
        case 'ram':
          ns.tprint(COLORS.BRIGHT_CYAN + "Buying ram for hacknet node " + indexes.ram + COLORS.RESET);
          ns.hacknet.upgradeRam(indexes.ram, flags.numRam);
          break;
        case 'core':
          ns.tprint(COLORS.BRIGHT_CYAN + "Buying core upgrade for hacknet node " + indexes.core + COLORS.RESET);
          ns.hacknet.upgradeCore(indexes.core, flags.numCores);
          break;
        case 'node':
          let newSvIdx = ns.hacknet.purchaseNode();
          ns.tprint(COLORS.BRIGHT_CYAN + "Bought new hacknet node: " + newSvIdx);
          numOfServers = ns.hacknet.numNodes();
          break;
      }
    }

    await ns.sleep(flags.sleepTime);
  }
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}
