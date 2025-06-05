const FLAGS = [
  ['headless', false],
  ['sort', 'value:desc'],
  ['filter', 'LEQ'],
  ['filterValue', Number.MAX_SAFE_INTEGER],
  ['help', false]
];

const FORMAT = "%-26s | %10s | %-5s | %-7s | %10s | %-10s";
const HEADER = [
  ["", "", "", "# of", "Rep /", ""],
  ["Name", "Rep", "Diff", "Actions", "Action", "Value"],
  ["-".repeat(24), "-".repeat(10), "-".repeat(5), "-".repeat(7), "-".repeat(10), "-".repeat(10)]
];

const VALID_KEYS = ['name', 'rep', 'difficulty', 'level', 'repPerAction', 'value'];
const NORMALIZED_KEYS = {
  name: 'name',
  rep: 'rep',
  difficulty: 'difficulty',
  level: 'level',
  repperaction: 'repPerAction',
  value: 'value'
};

/** @param {NS} ns **/
export async function main(ns) {
  ns.disableLog("ALL");
  ns.clearLog();

  const flags = ns.flags(FLAGS);

  if (flags.help) {
    printHelp(ns);
    return;
  }

  const locations = ns.infiltration.getPossibleLocations();
  if (!locations.length) {
    ns.tprint("No infiltratable locations found.");
    return;
  }

  const data = locations.map(loc => {
    const d = ns.infiltration.getInfiltration(loc.name);
    const rep = d.reward.tradeRep;
    const difficulty = d.difficulty;
    const repPerAction = rep / difficulty;
    const value = ((rep / d.maxClearanceLevel) / difficulty) + (rep / d.maxClearanceLevel);
    return {
      name: loc.name,
      rep,
      difficulty,
      level: d.maxClearanceLevel,
      repPerAction,
      value
    };
  });

  const sortFields = parseSortArgs(flags.sort);
  data.sort(multiFieldSorter(sortFields));

  if (!flags.headless) {
    for (const line of HEADER) ns.printf(FORMAT, ...line);
  }

  const filterOps = {
    EQU: (a, b) => a == b,
    NEQ: (a, b) => a != b,
    LSS: (a, b) => a < b,
    LEQ: (a, b) => a <= b,
    GTR: (a, b) => a > b,
    GEQ: (a, b) => a >= b
  };

  const filterFn = filterOps[flags.filter.toUpperCase()] || (() => true);

  for (const entry of data) {
    if (filterFn(entry.difficulty, flags.filterValue)) {
      ns.printf(FORMAT,
        entry.name,
        entry.rep.toFixed(3),
        entry.difficulty.toFixed(3),
        entry.level,
        entry.repPerAction.toFixed(3),
        entry.value.toFixed(3)
      );
    }
  }
}

/**
 * Normalize user-entered sort keys
 * @param {String} key
 * @returns {String|null}
 */
function normalizeKey(key) {
  return NORMALIZED_KEYS[key.replace(/[-_]/g, '').toLowerCase()] ?? null;
}

/**
 * Parse and validate sort string
 * @param {String} sortStr
 */
function parseSortArgs(sortStr) {
  return sortStr.split(',').map(s => {
    const [rawKey, rawDir] = s.split(':');
    const key = normalizeKey(rawKey);
    const dir = (rawDir || 'asc').trim().toLowerCase();

    if (!key) throw new Error(`Invalid sort key: "${rawKey}"`);

    return {
      key,
      dir: dir === 'desc' ? -1 : 1
    };
  });
}

/**
 * Multi-key sorter
 * @param {{key: string, dir: number}[]} fields
 */
function multiFieldSorter(fields) {
  return (a, b) => {
    for (const { key, dir } of fields) {
      if (a[key] < b[key]) return -1 * dir;
      if (a[key] > b[key]) return 1 * dir;
    }
    return 0;
  };
}

/**
 * Displays help text
 * @param {NS} ns
 */
function printHelp(ns) {
  const helpText = `
Usage:
  run infil.js [--sort keys] [--filter op] [--filterValue num] [--headless] [--help]

Description:
  Lists all infiltratable locations with relevant data including:
  reputation, difficulty, number of actions, reputation per action, and computed value.
  Allows sorting by multiple fields and filtering based on difficulty.

Options:
  --sort         Comma-separated list of sort keys (default: value:desc)
                 Format: key[:asc|desc][,key[:asc|desc]...]
                 Valid keys (case-insensitive, dashes/underscores allowed):
                   - name
                   - rep
                   - difficulty
                   - level
                   - repPerAction
                   - value

                 Example:
                   --sort rep-per-action:desc,value:asc

  --filter       Filter operator to apply on difficulty (default: LEQ)
                 Options:
                   - EQU  (equal)
                   - NEQ  (not equal)
                   - LSS  (less than)
                   - LEQ  (less than or equal)
                   - GTR  (greater than)
                   - GEQ  (greater than or equal)

  --filterValue  Value used with --filter to compare against difficulty
                 Default: ${Number.MAX_SAFE_INTEGER}

  --headless     If set, suppresses header output (default: false)

  --help         Show this help message and exit

Examples:
  run infil.js
    Show all infiltratable locations sorted by value descending.

  run infil.js --sort repPerAction:desc,value:asc
    Sort by rep per action descending, then by value ascending.

  run infil.js --filter GTR --filterValue 3
    Show only entries with difficulty greater than 3.

  run infil.js --headless
    Output results only, without header rows.
`;
  ns.tprint(helpText);
}

export function autocomplete(data, args) {
  data.flags(FLAGS);
  return [];
}
