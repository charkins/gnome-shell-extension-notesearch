/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */
/* Asynchronous Gnote Search Provider for Gnome Shell
 *
 * Copyright (c) 2011 Casey Harkins <charkins@pobox.com>
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

const Main = imports.ui.main;
const DBus = imports.dbus;
const Lang = imports.lang;
const Gettext = imports.gettext.domain('gnome-shell');
const St = imports.gi.St;
const Gio = imports.gi.Gio;
const Mainloop = imports.mainloop;
const _ = Gettext.gettext;
const Search = imports.ui.search;

const GnoteRemoteControl = {
    name: 'org.gnome.Gnote.RemoteControl',
    methods: [
        {
            name: 'DisplayNoteWithSearch',
            inSignature: 'ss',
            outSignature: 'b'
        },{
            name: 'SearchNotes',
            inSignature: 'sb',
            outSignature: 'as'
        },{
            name: 'GetNoteTitle',
            inSignature: 's',
            outSignature: 'a'
        }
    ]
};

/* gnoteSearchProvider holds the instance of the search provider
 * implementation. If null, the extension is either uninitialized
 * or has been disabled via disable().
 */
var gnoteSearchProvider = null;


function GnoteSearchProvider() {
    this._init();
}

GnoteSearchProvider.prototype = {
    __proto__: Search.SearchProvider.prototype,

    _init: function(name) {
        Search.SearchProvider.prototype._init.call(this, _("NOTES"));
        this._GnoteProxy = DBus.makeProxyClass(GnoteRemoteControl);
        this._gnote = new this._GnoteProxy(DBus.session,
            'org.gnome.Gnote',
            '/org/gnome/Gnote/RemoteControl');

        this._id = 0;
    },

    /* get the title and icon for a search result */
    getResultMeta: function(resultId) {
        let title = resultId.title;
        if(!title) title = 'Gnote Note';
        
        return { 'id': resultId,
                 'name': title,
                 'createIcon': function(size) {
                    let xicon = new Gio.ThemedIcon({name: 'gnote'});
                    return new St.Icon({icon_size: size,
                                        gicon: xicon});
                 }

               };
    },


    /* display a note with search terms highlighted */
    activateResult: function(id, params) {
        this._gnote.DisplayNoteWithSearchRemote(id.uri, id.search, function(reply,err) {});
    },

    /* start asynchronous search for terms */
    getInitialResultSet: function(terms) {
        this._id = this._id + 1;
        let searchId = this._id;
        let searchString = terms.join(' ');

        this.startAsync();

        this._gnote.SearchNotesRemote(searchString, false, Lang.bind(this,
            function(result, err) {
                if(result==null || result.length==null) {
                    return;
                }

                let searchResults = [];
                let searchCount = result.length;

                for (let i = 0; i < searchCount; i++) {
                    let r = result[i]
                    this._gnote.GetNoteTitleRemote(r, Lang.bind(this,
                        function(title, err) {
                            searchResults.push({
                                    'uri': r,
                                    'title': title,
                                    'search': searchString
                            });

                            /* once we have all results, post them if this is still the current search */
                            if(searchResults.length == searchCount && this._id == searchId) {
                                this.addItems(searchResults);
                            }
                        }
                    ));
                }
            }
        ), DBus.CALL_FLAG_START);

        return [];
    },

    /* Gnote doesn't provide a way for subsearching results, so
     * start with a fresh search, cancelling any previous running
     * asynchronous search. */
    getSubsearchResultSet: function(previousResults, terms) {
        this.tryCancelAsync();
        return this.getInitialResultSet(terms);
    },

    /* Cancel previous asynchronous search, called from tryCancelAsync(). */
    _asyncCancelled: function() {
        this._id = this._id + 1;
    }

};

function init() {
}

function enable() {
    if(gnoteSearchProvider==null) {
        gnoteSearchProvider = new GnoteSearchProvider();
        Main.overview.addSearchProvider(gnoteSearchProvider);
    }
}

function disable() {
    if(gnoteSearchProvider!=null) {
        Main.overview.removeSearchProvider(gnoteSearchProvider);
        gnoteSearchProvider = null;
    }
}
