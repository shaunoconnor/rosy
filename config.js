require.config({

	paths: {
		"$": "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
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
