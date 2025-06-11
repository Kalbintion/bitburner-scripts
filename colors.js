/**
 * Quick access to already created and specified colors without needing to request them through the COLOR_BUILDER
 */
export const COLORS = {
  BLACK: "\u001b[30m",
  RED: "\u001b[31m",
  GREEN: "\u001b[32m",
  YELLOW: "\u001b[33m",
  BLUE: "\u001b[34m",
  MAGENTA: "\u001b[35m",
  CYAN: "\u001b[36m",
  WHITE: "\u001b[37m",
  BRIGHT_BLACK: "\u001b[30;1m",
  BRIGHT_RED: "\u001b[31;1m",
  BRIGHT_GREEN: "\u001b[32;1m",
  BRIGHT_YELLOW: "\u001b[33;1m",
  BRIGHT_BLUE: "\u001b[34;1m",
  BRIGHT_MAGENTA: "\u001b[35;1m",
  BRIGHT_CYAN: "\u001b[36;1m",
  BRIGHT_WHITE: "\u001b[37;1m",
  RESET: "\u001b[0m",
  BOLD: "\u001b[1m",
  ITALIC: "\u001b[3m",
  UNDERLINE: "\u001b[4m",
  BACKGROUNDS: {
    BLACK: "\u001b[40m",
    RED: "\u001b[41m",
    GREEN: "\u001b[42m",
    YELLOW: "\u001b[43m",
    BLUE: "\u001b[44m",
    MAGENTA: "\u001b[45m",
    CYAN: "\u001b[46m",
    WHITE: "\u001b[47m",
    BRIGHT_BLACK: "\u001b[40;1m",
    BRIGHT_RED: "\u001b[41;1m",
    BRIGHT_GREEN: "\u001b[42;1m",
    BRIGHT_YELLOW: "\u001b[43;1m",
    BRIGHT_BLUE: "\u001b[44;1m",
    BRIGHT_MAGENTA: "\u001b[45;1m",
    BRIGHT_CYAN: "\u001b[46;1m",
    BRIGHT_WHITE: "\u001b[47;1m"
  }
}

/**
 * Creation of custom color setups that are not specified in COLORS enum
 */
export class COLOR_BUILDER {
  static ESCAPE = "\x1B"; // Equivalent to "\u001b"
  static PREFIX = "[";
  static SUFFIX = "m";
  static SEPARATOR = ";";

  static RESET = "0";
  static BOLD = "1";
  static ITALIC = "3";
  static UNDERLINE = "4";

  static BLACK = "30";
  static RED = "31";
  static GREEN = "32";
  static YELLOW = "33";
  static BLUE = "34";
  static MAGNETA = "35";
  static CYAN = "36";
  static WHITE = "37";

  static BACKGROUNDS = {
    BLACK: "40",
    RED: "41",
    GREEN: "42",
    YELLOW: "43",
    BLUE: "44",
    MAGENTA: "45",
    CYAN: "46",
    WHITE: "47"
  };

  /**
   * Creates the escape sequence necessary for a given color, background, and text styles
   * 
   * @param {String} color      One of the known color names
   * @param {String} background One of the known color names, defaults to none (empty string)
   * @param {Boolean} bold      Whether or not the text is bold, defaults to false
   * @param {Boolean} italic    Whether or not the text is italic, defaults to false
   * @param {Boolean} underline Whether or not the text is underlined, defaults to false
   * @return {String} Containing the resultant request. If the request fails, it returns an empty string.
   * NOTE: If a background is supplied but is not a valid color name, it will ignore it.
   */
  static REQUEST(color, background = "", bold = false, italic = false, underline = false) {
    if(COLOR_BUILDER.hasOwnProperty(color.toUpperCase())) {
      let builder = COLOR_BUILDER.ESCAPE + COLOR_BUILDER.PREFIX;

      builder += COLOR_BUILDER[color.toUpperCase()];
      if(background !== "" && COLOR_BUILDER.BACKGROUNDS.hasOwnProperty(background.toUpperCase())) {
        builder += COLOR_BUILDER.SEPARATOR + COLOR_BUILDER.BACKGROUNDS[background.toUpperCase()];
      }

      if(bold) {
        builder += COLOR_BUILDER.SEPARATOR + COLOR_BUILDER.BOLD;
      }

      if(italic) {
        builder += COLOR_BUILDER.SEPARATOR + COLOR_BUILDER.ITALIC;
      }

      if(underline) {
        builder += COLOR_BUILDER.SEPARATOR + COLOR_BUILDER.UNDERLINE;
      }

      builder += COLOR_BUILDER.SUFFIX;
      return builder;
    } else {
      return "";
    }
  }
}