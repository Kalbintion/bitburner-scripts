import { serverList } from "servers";

/** @param {NS} ns */
export async function main(ns) {
  let servers = ns.getPurchasedServers();

  for (i = 0; i < serverList.length; i++) {
    let servInfo = serverList[i];
    let servName = servInfo[0];
    servers.push(servName);
  }

  for (var i = 0; i < servers.length; i++) {
    ns.killall(servers[i]);
  }
}
