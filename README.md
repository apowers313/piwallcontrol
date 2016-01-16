## PiWallControl
Scripts for controlling a [PiWall](http://www.piwall.co.uk/)

## Installation
### 1. git scripts
Do the following:
- `git clone https://github.com/apowers313/piwallcontrol.git`
- `ln -s . piwallcontrol ~/bin`
- Raspberry Pi is smart enough to add `~/bin` to your `PATH` if the folder exists, but you will have to log out of your shell and log back in to pick up the new path.

### 2. List every PiWall tile in ~/.pilist:

~/.pilist
> pi@172.16.0.11<br>
> pi@172.16.0.12<br>
> pi@172.16.0.13<br>
> pi@172.16.0.14

Where `pi` will be the ssh username for the host. Will be used by `allwallcmd` as the username@host to ssh into the host.

### 3. /home/pi/media
Copy your videos to `/home/pi/media`. Every file or folder in `/home/pi/media` will be treated as its own playlist.

### 4. HDMI CEC (optional)
HDMI CEC is the protocol for sending remote control commands over a HDMI cable to control a TV (or other devices). It is used here to turn TVs on and off, using [libcec](https://github.com/Pulse-Eight/libcec). This, of course, requires that you have relatively modern piwall devices that support HDMI CEC (and that HDMI CEC is enabled on those devices, which isn't the likely default).

If you don't use HDMI CEC, be sure to comment out all the lines in `allwallon` and `allwalloff` so that you don't get errors when attempting to run `cec-client`.

To install HDMI CEC on all the tiles run these two commands:
- `allwallcmd -c hdmi-cec-install` : copies the install script to all tiles
- `allwallcmd hdmi-cec-install` : runs the install script on all tiles

### 5. rc.local (optional)
Add the following lines to the bottom of `/etc/rc.local` to start the PiWall at boot:
- `sudo -u pi /home/pi/bin/allwallstart -b -r &` : start the PiWall with the default playlist (whichever one was last). The `-b` argument is for boot, which causes `allwallstart` to wait an extra 30 seconds before doing its thing, so that all the tiles have a chance to finish booting.
- `sudo -u pi node /home/pi/bin/wallremote.js &` : start the PiWall remote control webserver, described below.

### 6. crontab (optional)
Add `allwallon` and `allwalloff` to your [crontab](http://crontab.org/) to have your TVs turn on and off at specific times of day.

# Using the Scripts
- allwallstart - stop all previously running scripts, turn on all TVs, start player on all tiles, start streaming specified video
- allwallstop - stop all previously running scripts
- allwallon - use HDMI CEC to turn on all TVs
- allwalloff - use HDMI CEC to turn off all TVs
- allwallplay - start players on all TVs
- allwallcmd - runs a command on each tile, based on the tiles listed in .pilist -- used by the other scripts to do their various things
- wallremote.js - a node.js script to start a webserver for controlling the PiWall -- used in conjunction with the [iOS Workflow App](https://workflow.is/)

