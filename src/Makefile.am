extensionurl = https://github.com/charkins/gnome-shell-extension-notesearch


topextensiondir = $(datadir)/gnome-shell/extensions

uuid = notesearch@charkins.github.com

extensiondir = $(topextensiondir)/$(uuid)

dist_extension_DATA = extension.js
nodist_extension_DATA = metadata.json $(EXTRA_EXTENSION)

EXTRA_DIST = metadata.json.in

metadata.json: metadata.json.in $(top_builddir)/config.status
	$(AM_V_GEN) sed -e "s|[@]LOCALEDIR@|$(datadir)/locale|" \
	    -e "s|[@]uuid@|$(uuid)|" \
	    -e "s|[@]url@|$(extensionurl)|" $< > $@

CLEANFILES = metadata.json

gschemas_in = com.github.charkins.notesearch.gschema.xml.in

@INTLTOOL_XML_NOMERGE_RULE@

gsettings_SCHEMAS = $(gschemas_in:.xml.in=.xml)

@GSETTINGS_RULES@

CLEANFILES += $(gschemas_in:.xml.in=.valid) $(gsettings_SCHEMAS)
EXTRA_DIST += $(gschemas_in)
