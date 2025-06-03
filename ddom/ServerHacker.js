import { FILES } from "/ddom/consts.js";

export class ServerHacker {
  /**
   * Hacks a given server based on the Server
   * @param {NS} ns
   * @param {Server} sv
   * @return {Boolean} True, if hacked, false otherwise
   */
  static hackServer(ns, sv) {
    let svDetails = new ServerDetails(ns, sv.hostname);
    return ServerHacker.hack(ns, svDetails);
  }

  /**
   * Hacks a given server based on Server or ServerDetails
   * @param {NS} ns
   * @param {ServerDetails | Server} sv
   * @return {Boolean} True, if hacked, false otherwise
   */
  static hack(ns, sv) {
    if (typeof sv === "Server") {
      sv = new ServerDetails(ns, sv.hostname);
    }

    if (!sv.hackable()) {
      return false;
    }

    // Check which programs exist
    let files = [
      { file: FILES.ssh, exists: false },
      { file: FILES.ftp, exists: false },
      { file: FILES.http, exists: false },
      { file: FILES.sql, exists: false },
      { file: FILES.smtp, exists: false }
    ];

    for (fil in files) {
      if (ns.fileExists(fil.file)) {
        fil.exists = true;
      }
    }

    // HACK!
    let portsOpened = 0;
    for (fil in files) {
      if (fil.exists) {
        switch (fil.file) {
          case FILES.ssh:
            ns.brutessh(sv.hostname);
            portsOpened++;
            break;
          case FILES.ftp:
            ns.ftpcrack(sv.hostname);
            portsOpened++;
            break;
          case FILES.http:
            ns.httpworm(sv.hostname);
            portsOpened++;
            break;
          case FILES.sql:
            ns.sqlinject(sv.hostname);
            portsOpened++;
            break;
          case FILES.smtp:
            ns.relaysmtp(sv.hostname);
            portsOpened++;
            break;
        }
      }
    }

    let secInfo = sv.fetchSecurity();
    if (secInfo.ports.open >= secInfo.ports.req) {
      ns.hack(sv.hostname);
      return true;
    }

    return false;
  }
}
