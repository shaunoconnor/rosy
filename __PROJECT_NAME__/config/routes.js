define(

	function () {

		"use strict";

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
							"viewClass" : "__PROJECT_NAME__/views/Home"),
							"route" : "/index.html",
							"config" : {
								"bodyClass" : "home",
								"title" : "Home"
							}
						},
						{
							"viewClass" : "__PROJECT_NAME__/views/About"),
							"route" : "/about.html",
							"config" : {
								"bodyClass" : "about",
								"title" : "About"
							}
						},
						{
							"viewClass" : "__PROJECT_NAME__/views/Contact"),
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
