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
							"viewClass" : namespace + "/views/Test1",
							"route" : "/test1",
							"config" : {
								"test" : "test1"
							}
						},
						{
							"viewClass" : namespace + "/views/Test2",
							"route" : "/test2",
							"config" : {
								"test" : "test2"
							}
						},
						{
							"viewClass" : namespace + "/views/Test3",
							"route" : "/test3",
							"config" : {
								"test" : "test3"
							}
						},
						{
							"viewClass" : namespace + "/views/Test4",
							"route" : "/test4",
							"config" : {
								"test" : "test4"
							}
						},
						{
							"viewClass" : namespace + "/views/Test5",
							"route" : "/test5",
							"config" : {
								"test" : "test5"
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
