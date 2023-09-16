# bitburnerScripts

## Repo's general informations

This is a personal collection of scripts (made by me and @XavePi) for the game [Bitburner](https://danielyxie.github.io/bitburner/) [(also on GitHub)](https://github.com/danielyxie/bitburner)

## Instructions for branch `scripts_up4303`

### Branch's general informations

**DO NOT PUSH DIRECTLY ! Always create a pull request, I'll approve it. Or not.**  
IMO branch protection system is a bit shitty and while possible I don't want to use it. Don't force me to, or I'll protect the full repo and you'll have to code on a fork.

*Full in-script documentation WIP.*

### File content

#### Legend

Custom marker | Legend
---|---
[FORMULAS] | Scripts requiering Formulas.exe

#### Content

* `/scripts/` - Contain all the code, separated in multiple files
  * `breacher.js` - Open all possible ports on target and nuke it
  * `buyServerAndDeploy.js` - Buy the maximum amount of servers (RAM specified in `/signals/purchasedServerRam.txt`) and deploy hack, grow and weaken scripts
  * `deletePurchasedServers.js` - Just delete all your purchased servers
  * `deployUpdate.js` - Deploy hack, grow and weaken scripts on all rooted servers
  * `grow.js` - A simple grow script
  * `hack.js` - A simple hack script
  * `homogenizePurchasedServers.js` - Homogenize purchased servers names "server-XXXX" and update their RAM (amount specified in `/signals/purchasedServerRam.txt`). Using it to rename servers make `/scripts/rem.js` lose track of them ! You'll have to relaunch it with `/scripts/watcher.js`
  * `lib.js` - Collection of multi-usage functions
  * `main.js` - Collection of scripts shortcuts
  * `rem.js` - Remote Event Manager, select the best target and manage scripts on all servers for hacking
  * `us.js` - Ultra Scan, display a list of all servers with their depth
  * `watcher.js` - Watch for hackable servers
  * `weaken.js` - A simple weaken script
* `/signals` - Used for env configuration and inter-script communication
  * `newHackedServers.txt` - Written by `/scripts/weaken.js` and read and emptied by `scripts/rem.js`
  * `purchasedServerRam.txt` - Environment variable, RAM amount for purchased servers. Should be a number, power of two between 1 and 1048576 included
  * `remVerbose.txt` - Environment variable, should `/scripts/rem.js` log the analysis for every server ?
