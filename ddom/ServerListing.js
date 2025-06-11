export class ServerListing {
  /**
   * Gets a list of servers based on certain criteria
   * @param {NS} ns
   * @param {ServerListingIncludes} includeOptions  The various include options available
   */
  static getServers(ns, includeOptions = new ServerListingIncludes()) {
    let servers = ["home"];
    let serversOut = [];

    for (var i = 0; i < servers.length; ++i) {
      let hostname = servers[i],
        sv = ns.getServer(hostname),
        maxRam = sv.maxRam,
        maxMoney = sv.maxMoney;

      let addServer = true;

      if(
        (!includeOptions.home && hostname.startsWith("home"))       // Are we adding home server?
        || (!includeOptions.pserv && hostname.startsWith("pserv-")) // Are we adding pserv- servers?
        || (!includeOptions.nomoney && (maxMoney <= 0))             // Are we adding 0 money servers?
        || (!includeOptions.noram && (maxRam <= 0))) {              // Are we adding 0 ram servers?
        addServer = false;
      }

      // Add server to output list
      if (addServer) {
        serversOut.push(hostname);
      }

      // Scan server and add unseen servers to scan list
      var newScan = ns.scan(hostname);
      for (var j = 0; j < newScan.length; j++) {
        if (servers.indexOf(newScan[j]) == -1) {
          servers.push(newScan[j]);
        }
      }
    }

    return serversOut;
  }
}

export class ServerListingIncludes {
  home = false;
  pserv = false;
  nomoney = false;
  noram = false;

  /**
   * @param {Boolean} home      Include "home" server
   * @param {Boolean} pserv     Include "pserv-*" server
   * @param {Boolean} nomoney   Include 0 max money servers
   * @param {Boolean} noram     Include 0 ram servers
   */
  constructor(home, pserv, nomoney, noram) {
    this.home = home;
    this.pserv = pserv;
    this.nomoney = nomoney;
    this.noram = noram;
  }

  /**
   * Sets all flags to true
   */
  enableAll() {
    this.home = true;
    this.pserv = true;
    this.nomoney = true;
    this.noram = true;
  }

  /**
   * Sets all flags to false
   */
  disableAll() {
    this.home = false;
    this.pserv = false;
    this.nomoney = false;
    this.noram = false;
  }

  /**
   * Sets home and pserv flags to true
   */
  enableOwned() {
    this.home = true;
    this.pserv = true;
  }

  /**
   * Sets home and pserv flags to false
   */
  disableOwned() {
    this.home = false;
    this.pserv = false;
  }
}