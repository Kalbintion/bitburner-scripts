export class ServerDetails {
  ns;
  sv;
  hostname;

  /**
   * @param {NS} ns
   * @param {String} target
   */
  constructor(ns, target) {
    this.ns = ns;

    if (!ns.serverExists(target)) {
      throw new Error("ERROR: Requested server does not exist! Hostname: " + target);
    }

    this.hostname = target;
    this.sv = ns.getServer(target);
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

  fetchTiming() {
    return new TimingData(
      this.ns.getHackTime(this.hostname),
      this.ns.getGrowTime(this.hostname),
      this.ns.getWeakenTime(this.hostname)
    );
  }

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

  fetchGrowth() {
    return new GrowthData(
      this.sv.serverGrowth,
      this.sv.moneyAvailable,
      this.sv.moneyMax
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
  hack() {
    return ServerHacker.hack(this.ns, this.sv);
  }

  /**
   * Calculates the servers value
   * @return {Number} A calculation of this servers worth
   */
  value() {
    let g = this.fetchGrowth(),
      t = this.fetchTiming();

    return ((g.money_max * g.growth) / t.grow / t.hack);
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

    ns.scp(files, dest, src);
  }

  /**
   * Checks if this server has a particular file
   * @param {String} file   A file to check
   */
  hasFile(file) {
    return ns.fileExists(file, this.hostname);
  }
}

export class SecurityData {
  root = false;
  base = Number.MAX_SAFE_INTEGER;
  min = Number.MAX_SAFE_INTEGER;
  cur = Number.MAX_SAFE_INTEGER;
  skill = Number.MAX_SAFE_INTEGER;
  /** @type {TimingData} */
  timing;
  /** @type {PortData} */
  ports;

  /**
   * @param {Boolean} root      Whether or not root access is available
   * @param {Number} base       Base security level
   * @param {Number} min        Minimum security level
   * @param {Number} cur        Current security level
   * @param {Number} skill      Required hacking skill
   * @param {TimingData} timing Status of timing information
   * @param {PortData} ports    Status of port information
   */
  constructor(root, base, min, cur, skill, timing, ports) {
    this.root = root;
    this.base = base;
    this.min = min;
    this.cur = cur;
    this.skill = skill;
    this.timing = timing;
    this.ports = ports;
  }
}

export class PortData {
  open = 0;
  req = Number.MAX_SAFE_INTEGER;
  ftp = false;
  ssh = false;
  smtp = false;
  sql = false;
  http = false;

  /**
   * @param {Number} open   Number of opened ports
   * @param {Number} req    Required number of opened ports
   * @param {Boolean} ftp   FTP port status
   * @param {Boolean} ssh   SSH port status
   * @param {Boolean} smtp  SMTP port status
   * @param {Boolean} sql   SQL port status
   * @param {Boolean} http  HTTP port status
   */
  constructor(open, req, ftp, ssh, smtp, sql, http) {
    this.open = open;
    this.req = req;
    this.ftp = ftp;
    this.ssh = ssh;
    this.smtp = smtp;
    this.sql = sql;
    this.http = http;
  }
}

export class TimingData {
  hack = Number.MAX_SAFE_INTEGER;
  grow = Number.MAX_SAFE_INTEGER;
  weak = Number.MAX_SAFE_INTEGER;

  constructor(hack, grow, weak) {
    this.hack = hack;
    this.grow = grow;
    this.weak = weak;
  }
}

export class GrowthData {
  growth = 0;
  money_current = 0;
  money_max = 0;

  constructor(growth, money_current, money_max) {
    this.growth = growth;
    this.money_current = money_current;
    this.money_max = money_max;
  }
}
