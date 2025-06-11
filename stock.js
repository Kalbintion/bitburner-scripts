const FLAGS = [
    ["silent", false],
    ["verbose", false],
    ["sleepTime", 6000],
    ["reserveRatio", 0.10],
    ["buyThreshold", 0.6],
    ["sellThreshold", 0.5],
  ];
  
  // Flat commission fee per transaction (100k)
  const COMMISSION_FEE = 100000;
  
  /** @param {NS} ns **/
  export async function main(ns) {
    // Disable all automatic logging
    ns.disableLog("ALL");
  
    const args = ns.flags(FLAGS);
  
    if (args._.length > 0) {
      const scriptName = ns.getScriptName();
      print(ns, `ERROR: Unexpected positional arguments: ${args._.join(", ")}`, args.verbose, args.silent);
      print(ns, `Usage: run ${scriptName} [--silent] [--verbose] [--sleepTime <ms>] [--reserveRatio <0-1>] [--buyThreshold <0-1>] [--sellThreshold <0-1>]`, args.verbose, args.silent);
      return;
    }
  
    const silent = args.silent;
    const verbose = args.verbose;
  
    // Helper function: always printf, tprintf only if verbose, no output if silent
    function print(ns, message, verboseFlag, silentFlag) {
      if (silentFlag) return;
      ns.printf(message);
      if (verboseFlag) ns.tprintf(message);
    }
  
    // Validate numeric flags and clamp if needed
    let sleepTime = Number(args.sleepTime);
    if (isNaN(sleepTime) || sleepTime < 0) {
      print(ns, `WARNING: --sleepTime must be a non-negative number. Using default 6000ms.`, verbose, silent);
      sleepTime = 6000;
    }
  
    let reserveRatio = Number(args.reserveRatio);
    if (isNaN(reserveRatio) || reserveRatio < 0 || reserveRatio > 1) {
      print(ns, `WARNING: --reserveRatio must be between 0 and 1. Using default 0.10.`, verbose, silent);
      reserveRatio = 0.10;
    }
  
    let buyThreshold = Number(args.buyThreshold);
    if (isNaN(buyThreshold) || buyThreshold < 0 || buyThreshold > 1) {
      print(ns, `WARNING: --buyThreshold must be between 0 and 1. Using default 0.6.`, verbose, silent);
      buyThreshold = 0.6;
    }
  
    let sellThreshold = Number(args.sellThreshold);
    if (isNaN(sellThreshold) || sellThreshold < 0 || sellThreshold > 1) {
      print(ns, `WARNING: --sellThreshold must be between 0 and 1. Using default 0.5.`, verbose, silent);
      sellThreshold = 0.5;
    }
  
    const symbols = ns.stock.getSymbols();
  
    while (true) {
      for (const sym of symbols) {
        const forecast = ns.stock.getForecast(sym);
        const [shares, avgPrice] = ns.stock.getPosition(sym);
        const price = ns.stock.getPrice(sym);
  
        // SELL if profitable after commission fees and forecast suggests to sell
        if (shares > 0) {
          const grossGain = shares * price;
          const netGain = grossGain - COMMISSION_FEE;
          const totalSpent = avgPrice * shares;
  
          if ((forecast < sellThreshold || price < avgPrice) && netGain > totalSpent) {
            ns.stock.sellStock(sym, shares);
            if (!silent) {
              print(
                ns,
                `Sold ${shares} of ${sym} at $${price.toFixed(2)} (forecast: ${forecast.toFixed(2)}). Net gain after commission: ${ns.formatNumber(netGain, 2)}`,
                verbose,
                silent
              );
            }
            continue;
          }
        }
  
        // BUY if forecast is good and no shares currently held
        if (forecast > buyThreshold && shares === 0) {
          const availableFunds = ns.getServerMoneyAvailable("home") * (1 - reserveRatio);
          const askPrice = ns.stock.getAskPrice(sym);
          const maxShares = ns.stock.getMaxShares(sym);
  
          // Account for commission fees: total cost = shares*price + commission
          const maxAffordableShares = Math.floor((availableFunds - COMMISSION_FEE) / askPrice);
          const sharesToBuy = Math.min(maxAffordableShares, maxShares);
  
          if (sharesToBuy > 0) {
            const totalCost = sharesToBuy * askPrice + COMMISSION_FEE;
            ns.stock.buyStock(sym, sharesToBuy);
            if (!silent) {
              print(
                ns,
                `Bought ${sharesToBuy} of ${sym} at $${askPrice.toFixed(2)} (forecast: ${forecast.toFixed(2)}). Total cost (incl. commission): ${ns.formatNumber(totalCost, 2)}`,
                verbose,
                silent
              );
            }
          }
        }
      }
      await ns.sleep(sleepTime);
    }
  }
  
  /** @param {AutocompleteData} data */
  export function autocomplete(data, args) {
    data.flags(FLAGS);
    return [];
  }
  