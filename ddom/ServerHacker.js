import { FILES } from "./consts.js";
import { IServerDetails } from "./IServerDetails.js";

export class ServerHacker {
  /**
   * Hacks a given server based on ServerDetails
   * @param {NS} ns
   * @param {IServerDetails} sv
   * @return {Boolean} True, if hacked, false otherwise
   */
  static async hack(ns, sv) {
    // Defensive check: wrap string check with typeof, fallback if needed
    if (typeof sv === "object" && sv.hostname !== undefined && !(sv instanceof IServerDetails)) {
      throw new Error("Invalid ServerDetails instance, got type: " + sv.constructor.name);
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
