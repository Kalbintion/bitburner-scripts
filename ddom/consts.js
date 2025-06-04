export const FILES = {
  ssh: "BruteSSH.exe",
  ftp: "FTPCrack.exe",
  http: "HTTPWorm.exe",
  sql: "SQLInject.exe",
  smtp: "relaySMTP.exe",
  nuke: "NUKE.exe",
  DDOM: { // Distributed Denial of Money
    master: "/ddom/master.js",
    slaveWeak: "/ddom/slave-weak.js",
    slaveHack: "/ddom/slave-hack.js",
    slaveGrow: "/ddom/slave-grow.js",

    serverDetails: "/ddom/ServerDetails.js",
    serverHacker: "/ddom/ServerHacker.js",
    serverListing: "/ddom/ServerListing.js",

    boxes: "/ddom/boxes.js",
    logger: "/ddom/logger.js",
    consts: "/ddom/consts.js"
  }
}

export const BB_CONSTS = {
  TIME_PER_TICK: 200,
  SEC_PER_HACK_THREAD: 0.002,
  SEC_PER_GROW_THREAD: 0.004,
  SEC_REDUCE_PER_WEAKEN_THREAD: 0.05
}
