/** @param {NS} ns */
export async function main(ns) {
    const flags = ns.flags([["test", false], ["abc", "123"]]);
    ns.tprint("Test: " + flags.test);
    ns.tprint("abc: " + flags.abc);
    ns.tprint("[0]: " + flags[0]);
    ns.tprint("_[0]:" + flags._[0]);
  }