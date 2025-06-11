export class Box {
  static B_TOP_L = "╔";
  static B_TOP_R = "╗";
  static B_BTM_L = "╚";
  static B_BTM_R = "╝";
  static B_SIDE_LR = "║";
  static B_SIDE_TB = "═";

  /**
   * @param {Number} width
   */
  static generateTopBar(width) {
    return Box.B_TOP_L + Box.B_SIDE_TB.repeat(width) + Box.B_TOP_R;
  };

  /**
   * @param {Number} width
   */
  static generateBottomBar(width) {
    return Box.B_BTM_L + Box.B_SIDE_TB.repeat(width) + Box.B_BTM_R;
  };

  /**
   * @param {Number} width
   * @param {String} message
   * @param {Boolean} rightAligned
   */
  static generateLine(width, message, rightAligned = false) {
    return sprintf(Box.B_SIDE_LR + "%" + (rightAligned ? "" : "-") + width + "s" + Box.B_SIDE_LR, message);
  };

  /**
   * @param {Number} width
   * @param {String} message
   * @param {Boolean} rightAligned
   */
  static generateLines(width, messages, rightAligned = false) {
    var out = [];
    for(var i = 0; i < messages.length; i++) {
      out.push(generateLine(width, message, rightAligned));
    }

    return out;
  };
}