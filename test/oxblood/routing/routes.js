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
						"useHistory" : false, // true|false|"#"
						"transition" : "sync" // sync|async|preload|reverse
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
						},
						{
							"viewClass" : null,
							"route" : "/nothing"
						},
						{
							"viewClass" : namespace + "/views/UpdateTest",
							"route" : "/update/:something?"
						},
						{
							"viewClass" : namespace + "/views/CanCloseTest",
							"route" : "/canClose"
						},
						{
							"viewClass" : namespace + "/views/Sync",
							"route" : "/transition/sync"
						},
						{
							"viewClass" : namespace + "/views/Async",
							"route" : "/transition/async"
						},
						{
							"viewClass" : namespace + "/views/Preload",
							"route" : "/transition/preload"
						},
						{
							"viewClass" : namespace + "/views/Reverse",
							"route" : "/transition/reverse"
						}
					]
				}
			]
		};
	}
);