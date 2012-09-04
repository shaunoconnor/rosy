define(

	function () {

		"use strict";

		var namespace = "__PROJECT_NAME__";

		function ns(route) {
			return namespace + route;
		}

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
							"viewClass" : ns("/views/Home"),
							"route" : "/",
							"config" : {
								"bodyClass" : "home",
								"title" : "Home"
							}
						},
						{
							"viewClass" : ns("/views/About"),
							"route" : "/about/:subSection?",
							"config" : {
								"bodyClass" : "about",
								"title" : "About"
							}

						},
						{
							"viewClass" : ns("/views/Contact"),
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
