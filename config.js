require.config(
	{
		paths: {
			"jquery": "//ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min",
			"$" : "libs/plugins/amd/$"
		},
		waitSeconds: 15,
		urlArgs : "cacheBust=" + (new Date()).getTime(),
		shim : {
			jquery : {exports : "jQuery"}
		}
	}
);