# About
Scripts for controlling a [PiWall](http://www.piwall.co.uk/)

# Installation
- git scripts
- List every PiWall tile in ~/.pilist:

~/.pilist
> pi@172.16.0.11<br>
> pi@172.16.0.12<br>
> pi@172.16.0.13<br>
> pi@172.16.0.14

Where `pi` will be the ssh username for the host. Will be used by `allwallcmd` as the username@host to ssh into the host.

- /home/pi/media
- HDMI CEC (optional)
- rc.local (optional)
- crontab (optional)

# Using the Scripts
- allwallstart - stop all previously running scripts, turn on all TVs, start player on all tiles, start streaming specified video
- allwallstop - stop all previously running scripts
- allwallon - use HDMI CEC to turn on all TVs
- allwalloff - use HDMI CEC to turn off all TVs
- allwallplay - start players on all TVs
- allwallcmd - runs a command on each tile, based on the tiles listed in .pilist -- used by the other scripts to do their various things
- wallremote.js - a node.js script to start a webserver for controlling the PiWall -- used in conjunction with the [iOS Workflow App](https://workflow.is/)

