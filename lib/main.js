// Import the APIs needed.
var contextMenu = require("context-menu");
var selection = require("selection");
var tabs = require("tabs");
var self = require('self');
var worker = require("page-worker");

exports.main = function(options, callbacks) {
	console.log('Lookup ' + options.loadReason);
	
	var context = contextMenu.SelectionContext();
	var keywd = '';
	
	// Context menu items
	/*
	var cald = contextMenu.Item({
		label: "Cambridge Advanced Learner's",
		data: self.data.url('query_form.html#')
	});
	*/
	var ldoce = contextMenu.Item({
		label: "Longman Contemporary English",
		data: self.data.url('http://www.ldoceonline.com/search/?q=')
	});
	
	var freedict = contextMenu.Item({
		label: "The Free Dictionary",
		data: "http://www.thefreedictionary.com/"
	});
	var urbanDict = contextMenu.Item({
		label: "Urban Dictionary",
		data: "http://www.urbandictionary.com/define.php?term="
	});
	var mwDict = contextMenu.Item({
		label: "Merriam Webster Dictionary",
		data: "http://www.merriam-webster.com/dictionary/"
	});
	var wiktionary = contextMenu.Item({
		label: "Wiktionary",
		data: "http://en.wiktionary.org/wiki/"
	});
	var googleDef = contextMenu.Item({
		label: "Google definitions",
		data: "http://www.google.com/search?tbs=dfn:1&q="
	});

	var LookupMenu = contextMenu.Menu({
		label: "Lookup definitions online",
		context: context,
		contentScript: 'on("click", function (node, data) {' +
			'postMessage(data);' +
		'});',
		items: [ldoce, freedict, urbanDict, mwDict, wiktionary, googleDef],
		onMessage: function(url) { tabs.open(url+keywd); }
	});
	
	// TODO
	function _processKeyword(text) {
		text = text.replace(/^\s+|\s+$/g, '');
		text = text.substring(0,45);
		return text;
	}
	
	tabs.on('activate', function onActivate(tab) {
	 	worker = tabs.activeTab.attach({
			contentScript:'postMessage(window.getSelection().toString());',
			onMessage: function (data) {
				keywd = _processKeyword(data);
				console.log('Lookup - keyword reset -> \''+keywd+'\'');
			}
		});
	});
	
	// for selection context
	function myListener() {
		keywd = _processKeyword(selection.text);
		console.log('Lookup -> keyword set -> \''+keywd+'\'');
	}
	selection.on('select', myListener);
	
};

exports.onUnload = function (reason) {
  console.log('Lookup '+reason);
};
