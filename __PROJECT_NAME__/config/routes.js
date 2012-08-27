define(

	function () {

		"use strict";

		var namespace = "__PROJECT_NAME__";

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
							"route" : "/",
							"config" : {
								"bodyClass" : "home",
								"title" : "Home"
							}
						},
						{
							"viewClass" : namespace + "/views/About",
							"route" : "/about/:subSection?",
							"config" : {
								"bodyClass" : "about",
								"title" : "About"
							}

						},
						{
							"viewClass" : namespace + "/views/Contact",
							"route" : "/contact",
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