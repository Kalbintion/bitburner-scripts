const FLAGS = [['clearAll', false], ['skipUtil', false], ['skipSetup', false], ['skipSv', false], ['keepHistory', false]];

/** @param {NS} ns */
export async function main(ns) {
    /**
     * Load up flags
     */
    const flags = ns.flags(FLAGS);

    if(flags.clearAll) {
        removeAllAlias();
    }

    if(!flags.keepHistory) {
        doCommand("cls");
    }
    
    /**
     * SETUP ALIASES FOR ENVIRONMENT
     */

    // Utility Functions
    if(!flags.skipUtil) {
        doAlias("aliases", "run /aliases.js");
        doAlias("updateScripts", "run /util/dl.js");

        doAlias("kia", "run /killitall.js");
        doAlias("eia", "run /enditall.js");
        doAlias("svinfo", "run /svinfo.js");
        doAlias("nmap", "run /nmap.js");
        doAlias("find", "run /find.js");
    }

    // Setup & Startups
    if(!flags.skipSetup) {
        doAlias("setup", "nmap.js; pwnitall.js; hacknet.js --maxServers 18 --sleepTime 200; stock.js --tail; ./setups/startup.js; ./setups/pstartup.js; ./setups/pstartup-home.js;");
        doAlias("startup", "run /setups/startup.js");
        doAlias("pstartup", "run /setups/pstartup.js");
        doAlias("phome", "run /setups/pstartup-home.js");
        doAlias("pia", "run /pwnitall.js");

        doAlias("ddom", "run /ddom/master.js");
    }

    // Server Purchasing & Upgrading
    if(!flags.skipSv) {
        doAlias("psv", "run /xsv/pSvNGB.js");
        doAlias("usv", "run /xsv/uSvNGB.js");

        doAlias("psv8", "run /xsv/pSvNGB.js --power 3");
        doAlias("usv8", "run /xsv/uSvNGB.js --power 3");

        doAlias("psv16", "run /xsv/pSvNGB.js --power 4");
        doAlias("usv16", "run /xsv/uSvNGB.js --power 4");

        doAlias("psv32", "run /xsv/pSvNGB.js --power 5");
        doAlias("usv32", "run /xsv/uSvNGB.js --power 5");

        doAlias("psv64", "run /xsv/pSvNGB.js --power 6");
        doAlias("usv64", "run /xsv/uSvNGB.js --power 6");
    }

    // Finally clear the terminal of output if desired
    if(!flags.keepHistory) {
        doCommand("cls");
    }

    ns.tprintf("Aliases have been setup!");
}

/**
 * Creates an alias to be used on the terminal
 * @param {String} alias 
 * @param {String} command 
 */
function doAlias(alias, command) {
    doCommand(`alias ${alias}="${command}"`);
}

/**
 * Removes an alias from being usable on the terminal
 * @param {String} alias 
 */
function removeAlias(alias) {
    doCommand(`unalias ${alias}`);
}

/**
 * Removes all aliases from being usable on the terminal
 */
function removeAllAlias() {
    doCommand(`unalias --all`);
}

/**
 * @param {AutocompleteData} data
 */
export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}


/**
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * WARNING - WARNING - WARNING - WARNING - WARNING
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * 
 * The function below contains a game spoiler
 * about how the game functions. Do not read the
 * doCommand function if you do not wish to be
 * spoiled! 
 * 
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 * WARNING - WARNING - WARNING - WARNING - WARNING
 * !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
 */

/**
 * Executes a command as if typed on the terminal manually
 * @param {String} command 
 */
function doCommand(command) {
    let doc = eval("document"); // Bypasses RAM usage of document call
    const term = doc.getElementById("terminal-input");

    term.value = command;

    // TODO: Make this better so it isnt always assumed [1] has __reactProps
    const handler = Object.keys(term)[1];       // Gets the reactProps handler
    term[handler].onChange({ target: term });   // Properly sets the value for react
    term[handler].onKeyDown(                    // Simulates enter being pressed
        { key: 'Enter', preventDefault: () => null }); 
}