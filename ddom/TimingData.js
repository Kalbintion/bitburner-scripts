export class TimingData {
  hack = Number.MAX_SAFE_INTEGER;
  grow = Number.MAX_SAFE_INTEGER;
  weak = Number.MAX_SAFE_INTEGER;

  /**
   * @param {Number} hack
   * @param {Number} grow
   * @param {Number} weak
   */
  constructor(hack, grow, weak) {
    this.hack = hack;
    this.grow = grow;
    this.weak = weak;
  }

  toString() {
    return `[TimingData] Hack: ${this.hack.toFixed(2)}ms, Grow: ${this.grow.toFixed(2)}ms, Weaken: ${this.weak.toFixed(2)}ms`;
  }
}
