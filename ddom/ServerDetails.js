import { IServerDetails } from "/ddom/IServerDetails.js";
import { ServerHacker } from "/ddom/ServerHacker.js";
import { SecurityData } from "/ddom/SecurityData.js";
import { RamData } from "/ddom/RamData.js";
import { TimingData } from "/ddom/TimingData.js";
import { GrowthData } from "/ddom/GrowthData.js";
import { PortData } from "/ddom/PortData.js";

export class ServerDetails extends IServerDetails {
  /** @type {NS} */
  ns;
  /** @type {Server} */
  sv;
  /** @type {String} */
  hostname;

  /**
   * @param {NS} ns
   * @param {String} target
   */
  constructor(ns, target) {
    super();
    this.ns = ns;

    if (!ns.serverExists(target)) {
      throw new Error("ERROR: Requested server does not exist! Hostname: " + target);
    }

    this.hostname = target;
    this.sv = ns.getServer(target);
  }

  /**
   * Kills all processes on the server
   * @returns {Boolean} True if any scripts were ended, false otherwise
   */
  endItAll() {
    return this.ns.killall(this.hostname, true);
  }

  /**
   * Refresh the servers sv reference
   */
  refresh() {
    this.sv = this.ns.getServer(this.hostname);
  }

  /**
   * Gets security information such as required skill, timing for
   * hack, weaken and grow. Open and required number of ports.
   * @returns {SecurityData} An object containing the various security information.
   */
  fetchSecurity() {
    return new SecurityData(
      this.sv.hasAdminRights || false,
      this.sv.baseDifficulty || Number.MAX_SAFE_INTEGER,
      this.sv.minDifficulty || Number.MAX_SAFE_INTEGER,
      this.sv.hackDifficulty || Number.MAX_SAFE_INTEGER,
      this.sv.requiredHackingSkill || Number.MAX_SAFE_INTEGER,
      this.fetchTiming(),
      this.fetchPorts()
    );
  }

  /**
   * Gets timing information for hack, grow and weaken
   * @returns {TimingData} An object containing the various timing information.
   */
  fetchTiming() {
    return new TimingData(
      this.ns.getHackTime(this.hostname),
      this.ns.getGrowTime(this.hostname),
      this.ns.getWeakenTime(this.hostname)
    );
  }

  /**
   * Gets the port information for which port(s) are open, number needed and number opened
   * @returns {PortData} An object containing the various port information.
   */
  fetchPorts() {
    return new PortData(
      this.sv.openPortCount,
      this.sv.numOpenPortsRequired,
      this.sv.ftpPortOpen,
      this.sv.sshPortOpen,
      this.sv.smtpPortOpen,
      this.sv.sqlPortOpen,
      this.sv.httpPortOpen
    );
  }

  /**
   * Gets the growth & money information about this server
   * @returns {GrowthData} An object containing the various growth information.
   */
  fetchGrowth() {
    return new GrowthData(
      this.sv.serverGrowth,
      this.sv.moneyAvailable,
      this.sv.moneyMax
    )
  }

  /**
   * Gets the RAM information about this server
   * @returns {RamData} An object containing the various RAM information.
   */
  fetchRAM() {
    return new RamData(
      this.sv.ramUsed,
      this.sv.maxRam
    )
  }

  /**
   * Determines of this given server is able to be hacked or not
   * checks player skill being sufficent and server is not already
   * rooted by the player.
   * @return {Boolean} true if it can be, and has not already been, hacked. Otherwise false
   */
  hackable() {
    let pSkill = this.ns.getHackingLevel();
    let sInfo = this.fetchSecurity();

    if (pSkill >= sInfo.skill && !sInfo.root) {
      return true;
    }

    return false;
  }

  /**
   * Hacks this given server, opening ports as required before running NUKE
   * @return {Boolean} True if hacked, false otherwise
   */
  async hack() {
    return await ServerHacker.hack(this.ns, this);
  }

  /**
   * Calculates the servers value
   * @return {Number} A calculation of this servers worth
   */
  value() {
    let g = this.fetchGrowth(),
      t = this.fetchTiming(),
      hc = this.ns.hackAnalyzeChance(this.hostname),
      ha = this.ns.hackAnalyze(this.hostname);

    return (g.money_max * ha * hc) / (t.hack + t.grow);
  }

  /**
   * Transfers files to the server from home
   * @param {String | String[]} files    A file, or array of files, to transfer
   * @param {String} src      The source hostname, defaults to home
   * @param {String} dest     The destination hostname, defaults to the ServerDetail's server
   */
  transfer(files, src = "home", dest = this.hostname) {
    if (typeof files == "string") {
      files = [files];
    }

    this.ns.scp(files, dest, src);
  }

  /**
   * Checks if this server has a particular file
   * @param {String} file   A file to check
   */
  hasFile(file) {
    return this.ns.fileExists(file, this.hostname);
  }
}