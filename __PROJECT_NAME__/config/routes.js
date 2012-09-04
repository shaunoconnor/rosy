define(

	function () {

		"use strict";

		var namespace = "routingExample";

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
							"route" : "/index.html",
							"config" : {
								"bodyClass" : "home",
								"title" : "Home"
							}
						},
						{
							"viewClass" : ns("/views/About"),
							"route" : "/about.html",
							"config" : {
								"bodyClass" : "about",
								"title" : "About"
							}
						},
						{
							"viewClass" : ns("/views/Contact"),
							"route" : "/contact.html",
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
