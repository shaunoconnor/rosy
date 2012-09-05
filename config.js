require.config({

	paths: {
		"$": "//ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min",
		// "$": "libs/jquery.js", // Replace above line to use local file
		"$plugin": "libs/plugins/amd/jquery-plugin",
		"templates" : "../../templates"
	},

	waitSeconds: 15,

	shim : {
		"$" : {
			exports : "jQuery"
		}
	}
});
