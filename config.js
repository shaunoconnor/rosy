require.config({
	paths: {
		"$": "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
		"$plugin" : "libs/plugins/amd/jquery-plugin",
		"underscore": "libs/lodash",
		"swig": "libs/swig.min",
		"History" : "libs/history.min",
		"html5shiv" : "libs/html5shiv.min",
		"Modernizr" : "libs/modernizr",
		"swfobject" : "libs/swfobject",
		"text" : "libs/plugins/amd/text",
		"json" : "libs/plugins/amd/json",
		"templates" : "../../templates"
	},
	waitSeconds: 15,
	shim : {
		"$" : {
			exports : "jQuery"
		},
		"underscore": {
			deps: [],
			exports: "_"
		},
		"swig": {
			deps: ["underscore"],
			exports : "swig"
		},
		"History": {
			exports : "History"
		},
		"Modernizr": {
			exports : "Modernizr"
		},
		"swfobject" : {
			exports : "swfobject"
		}
	}
});