import { FILES } from "/ddom/consts.js";
import { ServerDetails } from "/ddom/ServerDetails.js";

export class ServerHacker {
  /**
   * Hacks a given server based on the Server
   * @param {NS} ns
   * @param {Server} sv
   * @return {Boolean} True, if hacked, false otherwise
   */
  static hackServer(ns, sv) {
    const svDetails = new ServerDetails(ns, sv.hostname);
    return ServerHacker.hack(ns, svDetails);
  }

  /**
   * Hacks a given server based on ServerDetails
   * @param {NS} ns
   * @param {ServerDetails} sv
   * @return {Boolean} True, if hacked, false otherwise
   */
  static hack(ns, sv) {
    // Defensive check: wrap string check with typeof, fallback if needed
    if (typeof sv === "object" && sv.hostname !== undefined && !(sv instanceof ServerDetails)) {
      sv = new ServerDetails(ns, sv.hostname);
    }

    if (!sv.hackable()) return false;

    const actions = [
      { file: FILES.ssh, action: ns.brutessh },
      { file: FILES.ftp, action: ns.ftpcrack },
      { file: FILES.http, action: ns.httpworm },
      { file: FILES.sql, action: ns.sqlinject },
      { file: FILES.smtp, action: ns.relaysmtp }
    ];

    let portsOpened = 0;

    for (const { file, action } of actions) {
      if (ns.fileExists(file)) {
        if (action(sv.hostname)) {
          portsOpened++;
        }
      }
    }

    const secInfo = sv.fetchSecurity();
    if (portsOpened >= secInfo.ports.req) {
      ns.nuke(sv.hostname);
      return true;
    }

    return false;
  }
}
