require.config({

	paths : {
		"$" : "//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min",
		"CFInstall" : "//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min",
		"Cookies" : "libs/cookies",
		"Handlebars" : "libs/handlebars",
		"templates" : "../../templates",
		"$plugin" : "libs/plugins/amd/jquery-plugin",
		"text" : "libs/plugins/require/text",
		"json" : "libs/plugins/require/json"
	},

	waitSeconds : 15,

	shim : {
		"$" : {
			exports : "jQuery"
		},
		"libs/json3" : {
			exports : "JSON"
		},
		"CFInstall" : {
			exports : "CFInstall"
		},
		"Handlebars" : {
			exports : "Handlebars"
		}
	}
});
