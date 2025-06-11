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

  toString() {
    return `[SecurityData] Root: ${this.root}, Base: ${this.base}, Min: ${this.min}, Current: ${this.cur}, Skill: ${this.skill}, Timing: ${this.timing}, Ports: ${this.ports}`;
  }
}