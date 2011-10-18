Gnote Search Provider
=====================
A gnome-shell extension which searches [Gnote][1] notes and provides
them in your shell overview. This extension requires at least version
3.2 of gnome-shell (for asynchronous search provider support).

### Installation
* cp -R gnotesearch@tuxfoo.org/ ~/.local/share/gnome-shell/extensions/
* enable extension (e.g. via gnome-tweak-tool)

### Gnote Without Tray Icon
If you are using Gnote without the tray icon (default in 0.8.0 and 0.8.1),
you will likely want to apply the patch listed in [bug #653447][2]. This
extension will attempt to launch Gnote if it is not already running using
dbus activation. The default behavior of Gnote without the tray icon is
to display the window to search all notes. It is unlikely that this is
what you want when using this extension. The patch will add a new command
line option for running Gnote in the background and will use it when
activated via dbus. Alternatively, you can change "DBus.CALL_FLAG_START"
to "0" in extension.js to disable dbus activation, though no Gnote search
results will be returned unless a Gnote is running (i.e. a Gnote window
is open on one of your workspaces).

### License
Copyright (c) 2011 Casey Harkins <charkins@pobox.com>

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License
as published by the Free Software Foundation; either version 2
of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program; if not, write to the Free Software
Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.

[1]: https://live.gnome.org/Gnote
[2]: https://bugzilla.gnome.org/show_bug.cgi?id=653447
