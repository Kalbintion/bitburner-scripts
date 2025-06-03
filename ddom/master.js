import { ServerDetails } from "/ddom/ServerDetails.js";
import { ServerListing } from "/ddom/ServerListing.js";
import { LOGGER } from "/ddom/logger.js";
import { Box } from "/ddom/boxes.js";

import { COLOR_BUILDER, COLORS } from "/colors.js";

const FLAGS = [['help', undefined], ['log-self', "ALL"], ['silent', false], ['include-pserv', false], ['include-home', false], ['include-no-ram', false], ['include-no-money', false], ['sleepTime', 1000]];
const APP_NAME = "Distributed Denial of Money";
const APP_VER = "v1.0.0";
const APP_WIDTH = 80;

/** @param {NS} ns */
export async function main(ns) {
  // Load default flags
  const flags = ns.flags(FLAGS);
  if(flags.help !== undefined) {
    help(ns);
  }

  ns.disableLog(flags.log-self);
  ns.clearLog();

  LOGGER.annf(ns, flags, Box.generateTopBar(APP_WIDTH));
  LOGGER.annf(ns, flags, Box.generateLine(APP_WIDTH, " " + APP_NAME + " "));
  LOGGER.annf(ns, flags, Box.generateLine(APP_WIDTH, " " + APP_VER + " "));
  LOGGER.annf(ns, flags, Box.generateBottomBar(APP_WIDTH));

  var servers = new Map(),
      serverLister = new ServerListing,
      serverList = serverLister.getServers(ns, (flags.include-pserv && flags.include-home), flags.include-no-money, flags.include-no-ram);

  for (var i = 0; i < serverList.length; ++i) {
    try {
      servers.set(serverList[i], new ServerDetails(ns, serverList[i]));
    } catch(err) {
      ns.tprint("ERROR: " + err.message);
      ns.tprint(err.stack);
      ns.exit();
    }
  }

  while (true) {
    var bestServer = "n00dles";
    var bestServerValue = 0;

    let keys = servers.keys();

    for(var i = 0; i < keys.length; ++i) {
      var sv = servers.get(keys[i]);
      var newValue = sv.value(ns, host);

      if(newValue > bestServerValue) {
        bestServer = sv.hostname;
      }
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

  const FLAGS = [['help', undefined] ['log-self', "ALL"], ['silent', false], ['include-pserv', false], ['include-home', false], ['include-no-ram', false], ['include-no-money', false], ['sleepTime', 1000]];
  const italic = COLOR_BUILDER.REQUEST("white", "", false, true, false);
  const scriptName = ns.getScriptName();

  let args = "--include-pserv --include-home --include-no-ram --include-no-money --silent --log-self --sleepTime --help"
  let argFormat = "   %-20s %s";
  ns.tprintf("%s %s", italic + scriptName + COLORS.RESET + " ", args);

  ns.tprintf(argFormat, "--include-pserv", "Whether or not we are including pserv-* servers. Default false.");
  ns.tprintf(argFormat, "--include-home", "Wehtehr or not we are including the home server. Defaults false.");
  ns.tprintf(argFormat, "--include-no-ram", "Whether or not we are including 0 ram servers. Defaults false.");
  ns.tprintf(argFormat, "--include-no-money", "Whether or not we include servers with 0 max money. Defaults false.");
  ns.tprintf(argFormat, "--silent", "Determines if we should output anything at all to the terminal/logs. Defaults false");
  ns.tprintf(argFormat, "--log-self", "Determines what logs to turn off in the thread log. Defaults ALL");
  ns.tprintf(argFormat, "--sleepTime", "Time between checking which server is the best. Defaults 1000 ms");
  ns.tprintf(argFormat, "--help", "Displays this help text.");

  ns.exit();
}
