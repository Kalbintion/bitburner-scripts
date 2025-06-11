import { FILES } from "/ddom/consts.js";

export class DDOMTests {
  /**
   * Verifys that the FILES.DDOM elements exist as files
   * @param {NS} ns
   */
  static verifyDDOMFiles(ns) {
    if (!ns.fileExists(FILES.DDOM.slaveHack, "home") || !ns.fileExists(FILES.DDOM.slaveWeak, "home") || !ns.fileExists(FILES.DDOM.slaveGrow, "home")) {
      ns.tprint("ERROR: One or more slave scripts missing on home.");
      ns.exit();
    }
  }

  /**
   * Verifies that the scripts in FILES.DDOM exist
   * @param {NS} ns
   */
  static verifyScriptsDefined(ns) {
    const requiredScripts = ['slaveHack', 'slaveWeak', 'slaveGrow'];
    for (const key of requiredScripts) {
      if (typeof FILES.DDOM[key] !== 'string') {
        ns.tprint("ERROR: FILES.DDOM.${key} is not defined properly.");
        ns.exit();
      }
    }
  }

  /**
   * Verifies that the script ram values are non-zero
   * @param {NS} ns
   * @param {Number} hack
   * @param {Number} weak
   * @param {Number} grow
   */
  static verifyRamValues(ns, hack, weak, grow) {
    if (hack === 0 || weak === 0 || grow === 0) {
      ns.tprint("ERROR: One or more slave scripts have 0 RAM cost. Verify script exists and does not have errors.");
      ns.exit();
    }
  }

  /**
   * Verifies that the server list has actual servers
   * @param {NS} ns
   * @param {String[]} serverList
   */
  static verifyServerList(ns, serverList) {
    if (serverList.length === 0) {
      ns.tprint("ERROR: No servers found with current include flags.");
      ns.exit();
    }
  }

  /**
   * Verifies that the server value makes sense
   * @param {NS} ns
   * @param {ServerDetails} server
   */
  static verifyServerValue(ns, server) {
    let val = server.value();
    if (typeof val !== 'number' || !isFinite(val) || val < 0) {
      ns.tprint("ERROR: Server '${name}' returned invalid value score: ${val}");
      ns.exit();
    }
  }

  /**
   * Verifies the timing values make sense
   * @param {NS} ns
   * @param {ServerDetails} server
   */
  static verifyTiming(ns, server) {
    /** @type {TimingData} */
    let timingData = server.fetchTiming();
    if (![timingData.hack, timingData.grow, timingData.weak].every(x => typeof x === 'number' && x > 0)) {
      ns.tprint("ERROR: Invalid timing data returned from server. Check fetchTiming implementation.");
      ns.exit();
    }
  }
}