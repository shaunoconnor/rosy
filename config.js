require.config({

	paths: {
		"$": "//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min",
		// "$": "libs/jquery.js", // Replace above line to use local file
		"$plugin": "libs/plugins/amd/jquery-plugin",
		"Handlebars": "libs/handlebars",
		"templates" : "../../templates"
		"CFInstall" : "//ajax.googleapis.com/ajax/libs/chrome-frame/1.0.3/CFInstall.min",
		"Cookies" : "libs/cookies",
		"text" : "libs/plugins/require/text",
		"json" : "libs/plugins/require/json"
	},

	waitSeconds: 15,

	shim : {
		"$" : {
			exports : "jQuery"
		},
		"CFInstall" : {
			exports : "CFInstall"
		},
		"Handlebars" : {
			exports : "Handlebars"
		}
	}
});
