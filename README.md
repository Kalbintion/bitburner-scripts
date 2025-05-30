# About This Repo
This repository contains script that I wrote, modified, etc for playing the game [Bitburner](https://store.steampowered.com/app/1812820/Bitburner/). Scripts here presently target game version v2.8.1 (d0d776700)

# Notes
- Many of these scripts require the `colors.js` and/or the `nmap.js` file's output (`servers.js`) in order to function properly.
- All of these scripts can be acquired through the use of `wget` in-game through the files "Raw" link

# Recommended Aliases
The following aliases are used by me to minimize needing to run things one after another
- `alias setup="nmap.js; startup.js"` - To be ran after augmentation to get the initial hacks and setup. Will require `hack-template.js` unless another file is specified as `startup.js` accepts two arguments: `startup.js file-name target`
