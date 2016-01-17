## PiWallControl
Scripts for controlling a [PiWall](http://www.piwall.co.uk/). Check out the [wiki](https://github.com/apowers313/piwallcontrol/wiki) for this project for more information on this project.

## Installation
### 1. git scripts
Do the following:
- `git clone https://github.com/apowers313/piwallcontrol.git`
- `ln -s . piwallcontrol ~/bin`
- Raspberry Pi is smart enough to add `~/bin` to your `PATH` if the folder exists, but you will have to log out of your shell and log back in to pick up the new path.

### 2. List every PiWall tile in ~/.pilist:

An example `~/.pilist` for a four tile setup:
> pi@172.16.0.11<br>
> pi@172.16.0.12<br>
> pi@172.16.0.13<br>
> pi@172.16.0.14

Where `pi` will be the ssh username for the host. Will be used by `allwallcmd` as the username@host to ssh into the host.

Test out that it works by typing `allwallcmd ls`, which should run `ls` on each tile. Suffer through typing in your password for each tile.

To reduce future suffering:
- `ssh-keygen -t rsa` : to create a local ssh key
- `allwallcmd -k` : copy your local key to each host using `ssh-copy-id`
Now you won't need your password each time you run a command on every tile.

### 3. /home/pi/media
Copy your videos to `/home/pi/media`. Every file or folder in `/home/pi/media` will be treated as its own playlist.

You can play the media by typing `allwallstart <file or folder>` where file or folder is something that exists in your media folder. If it is a folder, the files will be played in the order that `ls` lists them. If you want them to play randomly use `allwallstart -r <folder>`.

Note that you may need to convert your media to get it to play correctly. Here is the command I use:
`avconv -i “$file" -crf 24 -vcodec libx264 -s hd720 -profile main -pre veryfast -an "$outfile"` (be sure to replace $file and $outfile with your file names, as appropriate).

Note that this also converts it to `hd720` (use `hd1080` if you'd like) and it strips all the audio using the `-an` flag.

### 4. HDMI CEC (optional)
HDMI CEC is the protocol for sending remote control commands over a HDMI cable to control a TV (or other devices). It is used here to turn TVs on and off, using [libcec](https://github.com/Pulse-Eight/libcec). This, of course, requires that you have relatively modern piwall devices that support HDMI CEC (and that HDMI CEC is enabled on those devices, which isn't the likely default).

If you don't use HDMI CEC, be sure to comment out all the lines in `allwallon` and `allwalloff` so that you don't get errors when attempting to run `cec-client`.

To install HDMI CEC on all the tiles run these two commands:
- `allwallcmd -c hdmi-cec-install` : copies the install script to all tiles
- `allwallcmd hdmi-cec-install` : runs the install script on all tiles

### 5. rc.local (optional)
Add the following lines to the bottom of `/etc/rc.local` to start the PiWall at boot:
- `sudo -u pi /home/pi/bin/allwallstart -b -r &` : start the PiWall with the default playlist (whichever one was last). The `-b` argument is for boot, which causes `allwallstart` to wait an extra 30 seconds before doing its thing, so that all the tiles have a chance to finish booting. Note: if you do this and your power goes out at 3am and then comes back on, you PiWall will turn back on at 3am. Just warning you.
- `sudo -u pi node /home/pi/bin/wallremote.js &` : start the PiWall remote control webserver, described below.

### 6. crontab (optional)
Add `allwallon` and `allwalloff` to your [crontab](http://crontab.org/) to have your TVs turn on and off at specific times of day.

### 7. Install Workflow and VideoWall Remote (optional)
Make sure that wallremote.js is running: `node ~/bin/wallremote.js`. You can verify that it is working right by going to `http://<your host>:8080/list`, which should list all your media files. 

Download and install [Workflow](https://workflow.is/) on your iOS device.

The `VideoWall Remote` workflow can be found [here](https://workflow.is/workflows/a604131dd20f4a259825cd9e026d7881) or by searching for `VideoWall Remote` in the workflow app.

# Using the Scripts
- allwallstart - stop all previously running scripts, copy the local ~/.piwall to each tile, turn on all TVs, start player on all tiles, start streaming specified video
- allwallstop - stop all previously running scripts
- allwallon - use HDMI CEC to turn on all TVs
- allwalloff - use HDMI CEC to turn off all TVs
- allwallplay - start players on all TVs
- allwallcmd - runs a command on each tile, based on the tiles listed in .pilist -- used by the other scripts to do their various things
- wallremote.js - a node.js script to start a webserver for controlling the PiWall -- used in conjunction with the [iOS Workflow App](https://workflow.is/)

