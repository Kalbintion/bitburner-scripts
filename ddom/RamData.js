export class RamData {
  used = 0;
  max = 0;
  free = 0;

  /**
   * @param {Number} used
   * @param {Number} max
   */
  constructor(used, max) {
    this.used = used;
    this.max = max;
    this.free = max - used;
  }

  toString() {
    return `[RamData] Used: ${this.used}GB, Free: ${this.free}GB, Max: ${this.max}GB`;
  }
}
