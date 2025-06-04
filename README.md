# About This Repo
This repository contains script that I wrote, modified, etc for playing the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts here presently target game version v2.8.1 (d0d776700)

# Notes
- Many of these scripts require the `colors.js` and/or the `nmap.js` file's output (`servers.js`) in order to function properly.
- All of these scripts can be acquired through the use of `wget` in-game through the files "Raw" link

# Early Game Scripts
The following is a list of early game scripts that can be used at any point
- `hack-template.js` &mdash; Basic hacking template, based on the games suggested one
- `hacknet.js` &mdash; Autobuy hacknet nodes, upgrading them, etc.
- `killitall.js` &mdash; Stop all running processes on all non-owned servers. **Requires** `nmap.js`, `colors.js`
- `pstartup.js` &mdash; Setups scripts on `pserv-` servers and runs them.
- `pserv.js` &mdash; Script, similar to `hack-template.js` used on `pserv-` servers that peppers all available servers for a weaken, grow, or hack call
- `startup.js` &mdash; Sets up all hack scripts on all other servers.
- `uSv8GB.early.js` &mdash; Initially called `uSv8GB.js`, this script will upgrade `pserv-` servers to 16GB. This function was replaced by the `uSvNGB.js` file

# Mid-Game Scripts
The following is a list of mid-game scripts that can be used at any point but generally after a few RAM upgrades
- `/ddom/master.js` &mdash; Manages, maintains and distributes hack, grow, weaken functions targeting the best currently hackable server using all available resources on other servers.
- `phome.js` &mdash; Script intended for the home server for pepper-spraying all hackable servers.
- `pstartup-home.js` &mdash; Start-up script for `phome.js` but creates a number of instances on `home` until it reaches max RAM usage.
- `pwnitall.js` &mdash; Constantly checks, evaluates and hacks servers to have root access. Does not automatically execute scripts on them.
- `uSvNGB.js` &mdash; Upgrades all bought `pserv-` servers to a dedicated `--size x` or `--power x` (2^x)

# Utility Scripts
The following is a list of scripts for utility purposes and do not necessarily impact anything.
- `colors.js` &mdash; Utility methods for creating text colors either through `COLORS` for pre-defined colors or `COLOR_BUILDER` for `REQUEST`ing one.
- `find.js` &mdash; Utility script for finding the path to a server, useful for hacking various servers such as CSEC
- `nmap.js` &mdash; Utility script that outputs server information to `servers.js` that is then imported by other scripts

# Recommended Aliases
The following aliases are used by me to minimize needing to run things one after another
- `alias setup="nmap.js; startup.js;"` &mdash; To be ran after augmentation to get the initial hacks and setup. Will require `hack-template.js` unless another file is specified as `startup.js` accepts two arguments: `startup.js file-name target`
- `alias setup2="hacknet.js --maxServers 17; pstartup-home.js; pwnitall.js;` &mdash; To be ran after augmentation to get hacknet nodes, home server and general rooting going.
- `alias kia="killitall.js"` &mdash; General shorthand alias for the script.
- `alias find="find.js"` &mdash; General shorthand alias for the script.
- `alias uSv="uSvNGB.js"` &mdash; General shorthand alias for the script.
