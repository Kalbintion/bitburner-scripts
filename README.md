# About This Repo
This repository contains script that I wrote, modified, etc for playing the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts here presently target game version v2.8.1 (d0d776700)

# Notes
- Many of these scripts require the `colors.js` and/or the `nmap.js` file's output (`servers.js`) in order to function properly.
- All of these scripts can be acquired through the use of `wget` in-game through the files "Raw" link

# Early Game Scripts
The following is a list of early game scripts that can be used at any point
- [hack-template.js](hack-template.js) &mdash; Basic hacking template, based on the games suggested one
- [hacknet.js](hacknet.js) &mdash; Autobuy hacknet nodes, upgrading them, etc.
- [killitall.js](killitall.js) &mdash; Stop all running processes on all non-owned servers. **Requires**: `nmap.js`, `colors.js`
- [pserv.js](pserv.js) &mdash; Script, similar to `hack-template.js` used on `pserv-` servers that peppers all available servers for a weaken, grow, or hack call
- [pstartup.js](pstarutp.js) &mdash; Setups scripts on `pserv-` servers and runs them.
- [startup.js](startup.js) &mdash; Sets up all hack scripts on all other servers.

# Mid-Game Scripts
The following is a list of mid-game scripts that can be used at any point but generally after a few RAM upgrades
- [/ddom/master.js](ddom/master.js) &mdash; Manages, maintains and distributes hack, grow, weaken functions targeting the best currently hackable server using all available resources on other servers.
- [phome.js](phome.js) &mdash; Script intended for the home server for pepper-spraying all hackable servers.
- [pstartup-home.js](pstartup-home.js) &mdash; Start-up script for `phome.js` but creates a number of instances on `home` until it reaches max RAM usage.
- [pwnitall.js](pwnitall.js) &mdash; Constantly checks, evaluates and hacks servers to have root access. Does not automatically execute scripts on them.
- [uSvNGB.js](xsv/uSvNGB.js) &mdash; Upgrades all bought `pserv-` servers to a dedicated `--size x` or `--power x` (2^x)
- [pSvNGB.js](xsv/pSvNGB.js) &mdash; Purchases servers (`pserv-`) until they cannot be bought anymore. Accepts the same `--size x` or `--power x` flags as `uSvNGB.js`

# Utility Scripts
The following is a list of scripts for utility purposes and do not necessarily impact anything.
- [colors.js](colors.js) &mdash; Utility methods for creating text colors either through `COLORS` for pre-defined colors or `COLOR_BUILDER` for `REQUEST`ing one.
- [find.js](find.js) &mdash; Utility script for finding the path to a server, useful for hacking various servers such as CSEC
- [infil.js](infil.js) &mdash; Utility script to determine which infiltration is best to manually target. Offers plenty of flag options for filter, see `--help` for more info.
- [nmap.js](nmap.js) &mdash; Utility script that outputs server information to `servers.js` that is then imported by other scripts
- [aliases.js](aliases.js) &mdash; Utility script that automatically creates aliases for easier management and usage of all the scripts found in this repo.

# Recommended Aliases
- See the file [aliases.js](aliases.js) for a list of aliases and their commands for suggested aliases. **WARNING**: This file contains a major game spoiler! To avoid spoilers, only read the `main()` function
