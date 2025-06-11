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
        doAlias("kia", "run /killitall.js");
        doAlias("eia", "run /enditall.js");
        doAlias("svinfo", "run /svinfo.js");
        doAlias("nmap", "run /nmap.js");
        doAlias("find", "run /find.js");
        doAlias("aliases", "run /aliases.js");
    }

    // Setup & Startups
    if(!flags.skipSetup) {
        doAlias("setup", "nmap.js; startup.js; pstartup.js pstartup-home.js; pwnitall.js; hacknet.js --maxServers 18 --sleepTime 200; stock.js --tail");
        doAlias("startup", "run /startup.js");
        doAlias("pstartup", "run /pstartup.js");
        doAlias("phome", "run /pstartup-home.js");
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
 * Executes a command as if typed on the terminal manually
 * @param {String} command 
 */
function doCommand(command) {
    let doc = eval("document");
    const term = doc.getElementById("terminal-input");

    term.value = command;

    const handler = Object.keys(term)[1];

    term[handler].onChange({ target: term });
    term[handler].onKeyDown({ key: 'Enter', preventDefault: () => null });
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