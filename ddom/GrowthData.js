export class GrowthData {
  growth = 0;
  money_current = 0;
  money_max = 0;

  /**
   * @param {Number} growth
   * @param {Number} money_current
   * @param {Number} money_max
   */
  constructor(growth, money_current, money_max) {
    this.growth = growth;
    this.money_current = money_current;
    this.money_max = money_max;
  }

  toString() {
    return `[GrowthData] Growth: x${this.growth}, Money: ${this.money_current} / ${this.money_max}`;
  }
}
