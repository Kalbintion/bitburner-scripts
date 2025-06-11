export class LOGGER {
  /**
   * Logs (prints to apps console) a message
   * @param {NS} ns
   * @param {FLAGS} flags
   * @param {String} message
   */
  static log(ns, flags, message) {
    if(!flags.silent) {
      ns.print(message);
    }
  };

  /**
   * Announces (prints to main console) a message
   * @param {NS} ns
   * @param {FLAGS} flags
   * @param {String} message
   */
  static ann(ns, flags, message) {
    if(!flags.silent) {
      ns.tprint(message);
    }
  };

  /**
   * Logs (prints to apps console) a formatted message request.
   * @param {NS} ns
   * @param {FLAGS} flags
   * @param {String} format
   * @param {Any} ...args
   */
  static logf(ns, flags, format, ...args) {
    if(!flags.silent) {
      ns.printf(format, ...args);
    }
  };

  /**
   * Announce's (prints to main console) a formatted message request.
   * @param {NS} ns
   * @param {FLAGS} flags
   * @param {String} format
   * @param {Any} ...args
   */
  static annf(ns, flags, format, ...args) {
    if(!flags.silent) {
      ns.tprintf(format, ...args);
    }
  };
}