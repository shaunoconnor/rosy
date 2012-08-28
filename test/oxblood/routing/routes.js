define(

	function () {

		"use strict";

		var namespace = "routing";

		return {

			"aliases" : {

			},

			"viewGroups" : [
				{
					"config" : {
						"id" : "main",
						"selector" : "#main",
						"useHistory" : true, // true|false|"#"
						"transition" : "async" // sync|async|preload|reverse
					},

					"routes" : [
						{
							"viewClass" : namespace + "/views/Home",
							"route" : "/test",
							"config" : {
								"bodyClass" : "home",
								"title" : "Home"
							}
						},
						{
							"viewClass" : namespace + "/views/About",
							"route" : "/test/about/:subSection?",
							"config" : {
								"bodyClass" : "about",
								"title" : "About"
							}

						},
						{
							"viewClass" : namespace + "/views/Contact",
							"route" : "/test/contact",
							"config" : {
								"bodyClass" : "contact",
								"title" : "Contact"
							}
						}
					]
				}
			]
		};
	}
);