// Utility Imports
import { LOGGER } from "./logger.js";
import { Box } from "./boxes.js";
import { COLOR_BUILDER, COLORS } from "/colors.js";

// Function Imports
import { ServerDetails } from "./ServerDetails.js";
import { ServerListing, ServerListingIncludes } from "./ServerListing.js";
import { TimingData } from "./TimingData.js";
import { DDOMTests } from "./tests.js";

// Other Imports
import { FILES, BB_CONSTS } from "./consts.js";

const FLAGS = [
  ['help', false],
  ['log-self', "ALL"],
  ['silent', false],
  ['include-pserv', false],
  ['include-home', false],
  ['include-no-ram', false],
  ['include-no-money', false],
  ['sleepTime', 1000],
  ['debug', false]
];
const APP_NAME = "Distributed Denial of Money";
const APP_VER = "v1.0.0";
const APP_WIDTH = 80;

/** @param {NS} ns */
export async function main(ns) {
  // Load default flags
  const flags = ns.flags(FLAGS);
  if (flags.help) {
    help(ns);
  }

  // Disable and clear log
  ns.disableLog(flags['log-self']);
  ns.clearLog();

  // Application header
  LOGGER.annf(ns, flags, Box.generateTopBar(APP_WIDTH));
  LOGGER.annf(ns, flags, Box.generateLine(APP_WIDTH, " " + APP_NAME + " "));
  LOGGER.annf(ns, flags, Box.generateLine(APP_WIDTH, " " + APP_VER + " "));
  LOGGER.annf(ns, flags, Box.generateBottomBar(APP_WIDTH));

  // Basic Sanity Checks
  DDOMTests.verifyScriptsDefined(ns); // FILES.DDOM keys must be defined
  DDOMTests.verifyDDOMFiles(ns);      // FILES.DDOM files must exist on home

  /* Variable setup */
  // Script RAM usage
  const rHack = ns.getScriptRam(FILES.DDOM.slaveHack);
  const rWeak = ns.getScriptRam(FILES.DDOM.slaveWeak);
  const rGrow = ns.getScriptRam(FILES.DDOM.slaveGrow);

  DDOMTests.verifyRamValues(ns, rHack, rWeak, rGrow);   // Make sure ram costs are not 0

  // Get available server listing
  const serverInclude = new ServerListingIncludes(
    flags["include-home"], flags["include-pserv"], flags["include-no-money"], flags["include-no-ram"]);

  var servers = new Map(),
    serverList = ServerListing.getServers(ns, serverInclude);

  DDOMTests.verifyServerList(ns, serverList); // Must have actual servers to look over

  // Create each servers details
  for (var i = 0; i < serverList.length; ++i) {
    try {
      let details = new ServerDetails(ns, serverList[i]);

      // Do some basic checks on server
      DDOMTests.verifyTiming(ns, details);
      DDOMTests.verifyServerValue(ns, details);

      // Add server to the list
      servers.set(serverList[i], details);
    } catch (err) {
      ns.tprint("ERROR: " + err.message);
      ns.tprint(err.stack);
      ns.exit();
    }
  }

  // Setup enacted server vars, these are the currently targeted server
  var enactedServer = "";
  var enactedServerValue = 0;

  while (true) {
    // Setup best vars, these are the currently best targetable server
    var bestServer = "n00dles";
    var bestServerValue = 0;

    let keys = [...servers.keys()];

    // Check each server for which is best
    for (const key of keys) {
      /** @type {ServerDetails} */
      let sv = servers.get(key);

      if (flags.debug) {
        ns.printf("[DEBUG] Checking server %s", sv.hostname);
      }

      // Have we already hacked or is it hackable? If so, do it
      if (sv.hackable()) {
        if (flags.debug) {
          ns.printf("[DEBUG] Hacking server %s", sv.hostname);
        }
        await sv.hack();
      }

      // We have access to run scripts.
      await sv.transfer([FILES.DDOM.slaveWeak, FILES.DDOM.slaveHack, FILES.DDOM.slaveGrow], "home");

      // Get server value
      var newValue = sv.value();
      if (flags.debug) {
        ns.printf("[DEBUG] Determined server %s has value of %s", sv.hostname, newValue);
      }

      // Update best if current server is better
      if (newValue > bestServerValue) {
        if (flags.debug) {
          ns.printf("[DEBUG] Server %s has better value (%s) than %s with %s", sv.hostname, newValue, bestServer, bestServerValue);
        }
        bestServer = sv.hostname;
        bestServerValue = newValue;
      }
    }

    // If the best server is already enacted upon, do nothing
    if (bestServer !== enactedServer) {
      LOGGER.annf(ns, flags, "[DDOM] Enacting upon new best server: %s with value of %s. Previous server was %s with value %s", bestServer, bestServerValue, enactedServer, enactedServerValue);

      enactedServer = bestServer;
      enactedServerValue = bestServerValue;

      // Act upon best server
      /** @type {ServerDetails} */
      const svBest = servers.get(bestServer);
      /** @type {TimingData} */
      const timingData = svBest.fetchTiming();

      const tHack = timingData.hack,
        tGrow = timingData.grow,
        tWeak = timingData.weak,
        spacing = BB_CONSTS.TIME_PER_TICK;

      const hackFraction = ns.hackAnalyze(enactedServer);
      const stealPercent = 0.10;
      const threadsHack = Math.floor(stealPercent / hackFraction);
      const threadsWeak1 = Math.ceil((threadsHack * BB_CONSTS.SEC_PER_HACK_THREAD) / BB_CONSTS.SEC_REDUCE_PER_WEAKEN_THREAD);
      const maxMoney = ns.getServerMaxMoney(enactedServer);
      const moneyStolen = maxMoney * stealPercent;
      const growMultiplier = maxMoney / (maxMoney - moneyStolen);
      const threadsGrow = Math.ceil(ns.growthAnalyze(enactedServer, growMultiplier));
      const threadsWeak2 = Math.ceil((threadsGrow * BB_CONSTS.SEC_PER_GROW_THREAD) / BB_CONSTS.SEC_REDUCE_PER_WEAKEN_THREAD);

      if (flags.debug) {
        ns.printf("Enacted Server Data [%s]", enactedServer);
        ns.printf("Hack Fraction: %s", hackFraction);
        ns.printf("Steal Percent: %s", stealPercent);
        ns.printf("# Threads [Hack]: %s", threadsHack);
        ns.printf("# Threads [Weak 1]: %s", threadsWeak1);
        ns.printf("# Threads [Grow]: %s", threadsGrow);
        ns.printf("# Threads [Weak 2]: %s", threadsWeak2);
        ns.printf("Max Money: %s", maxMoney);
        ns.printf("Money Stolen: %s", moneyStolen);
        ns.printf("Grow Mult: %s", growMultiplier);
      }

      const tThreads = [
        { script: FILES.DDOM.slaveWeak, threads: threadsWeak1, ramPerThread: rWeak, delay: 0 },
        { script: FILES.DDOM.slaveHack, threads: threadsHack, ramPerThread: rHack, delay: tWeak - tHack - spacing },
        { script: FILES.DDOM.slaveGrow, threads: threadsGrow, ramPerThread: rGrow, delay: tWeak - tGrow + spacing },
        { script: FILES.DDOM.slaveWeak, threads: threadsWeak2, ramPerThread: rWeak, delay: spacing * 2 }
      ];

      for (const { script, threads, ramPerThread, delay } of tThreads) {
        let remaining = threads;

        if (flags.debug) {
          ns.printf("[DEBUG] Remaining threads for %s is %s", script, remaining);
        }

        for (var i = 0; i < keys.length; ++i) {
          var server = servers.get(keys[i]);
          if (server.sv.hasAdminRights) {
            server.refresh();
            var sRam = server.fetchRAM();
            var sRamFree = sRam.free;

            const maxThreads = Math.floor(sRamFree / ramPerThread);
            const useThreads = Math.min(remaining, maxThreads);

            if (useThreads <= 0) continue;

            const pid = ns.exec(script, server.hostname, useThreads, enactedServer, delay);
            if (pid === 0) {
              ns.tprintf("WARN: Failed to run %s on %s with %d threads", script, server.hostname, useThreads);
            } else {
              if (flags.debug) {
                ns.printf("Ran script %s on server %s with threads %s", script, server.hostname, useThreads);
              }
            }

            sRamFree -= useThreads * ramPerThread;
            remaining -= useThreads;

            if (flags.debug) {
              ns.printf("[DEBUG] Remaining threads for %s is now %s", script, remaining);
            }

            if (remaining <= 0) break;
          }
        }
      }
    }

    if (flags.debug) {
      ns.printf("[DEBUG] Sleeping for %s", flags.sleepTime);
    }
    await ns.sleep(flags.sleepTime);
  }
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}

/**
 * Prints help and exits script execution
 * @param {NS} ns
 */
function help(ns) {
  ns.tprintf("%s", Box.generateTopBar(APP_WIDTH));
  ns.tprintf("%s", Box.generateLine(APP_WIDTH, " " + APP_NAME + " Help"));
  ns.tprintf("%s", Box.generateLine(APP_WIDTH, APP_VER + " ", true));
  ns.tprintf("%s", Box.generateBottomBar(APP_WIDTH));

  const italic = COLOR_BUILDER.REQUEST("white", "", false, true, false);
  const scriptName = ns.getScriptName();

  let args = "--include-pserv --include-home --include-no-ram --include-no-money --silent --log-self --sleepTime --help"
  let argFormat = "   %-20s %s";
  ns.tprintf("%s %s", italic + scriptName + COLORS.RESET + " ", args);

  ns.tprintf(argFormat, "--include-pserv", "Whether or not we are including pserv-* servers. Default false.");
  ns.tprintf(argFormat, "--include-home", "Whether or not we are including the home server. Defaults false.");
  ns.tprintf(argFormat, "--include-no-ram", "Whether or not we are including 0 ram servers. Defaults false.");
  ns.tprintf(argFormat, "--include-no-money", "Whether or not we include servers with 0 max money. Defaults false.");
  ns.tprintf(argFormat, "--silent", "Determines if we should output anything at all to the terminal/logs. Defaults false");
  ns.tprintf(argFormat, "--log-self", "Determines what logs to turn off in the thread log. Defaults ALL");
  ns.tprintf(argFormat, "--sleepTime", "Time between checking which server is the best. Defaults 1000 ms");
  ns.tprintf(argFormat, "--help", "Displays this help text.");

  ns.exit();
}