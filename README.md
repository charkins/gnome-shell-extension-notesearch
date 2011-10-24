Note Search Provider
=====================
A gnome-shell extension which searches [Gnote][1] or [Tomboy][2] notes and
provides them in your shell overview. This extension requires at least
version 3.2 of gnome-shell (for asynchronous search provider support).

### Installation
* ./autogen.sh --prefix=/usr/local && make && sudo make install
* enable extension (e.g. via gnome-tweak-tool)

### Selecting Your Note Application
By default, this extension will use Gnote as the note application. To change
the note application, use gsettings:

    gsettings set com.github.charkins.notesearch app Tomboy

or

    gsettings set com.github.charkins.notesearch app Gnote

To see which note application is currently configured:

    gsettings get com.github.charkins.notesearch app

### Gnote Without Tray Icon
If you are using Gnote without the tray icon (default in 0.8.0 and 0.8.1),
you may want to apply the patch listed in [bug #653447][3]. This
extension will attempt to launch Gnote if it is not already running using
dbus activation. The default behavior of Gnote without the tray icon is
to display the window to search all notes. It is unlikely that this is
what you want when using this extension. The patch will add a new command
line option for running Gnote in the background and will use it when
activated via dbus. Alternatively, enable the tray icon until some form
of background support is merged upstream.

### License
Copyright (c) 2011 Casey Harkins <charkins@pobox.com>

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

[1]: https://live.gnome.org/Gnote
[2]: http://projects.gnome.org/tomboy/
[3]: https://bugzilla.gnome.org/show_bug.cgi?id=653447
