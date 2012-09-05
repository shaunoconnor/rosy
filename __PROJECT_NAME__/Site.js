define(

	[
		"red/base/Class",
		"red/views/ViewManager",
		"./config/routes"
	],

	function (Class, ViewManager, routes) {

		"use strict";

		var Site = Class.extend({

			initialize : function () {

				ViewManager.initialize({
					// mode					:	hard|soft|hash,
					// selectors			:	Array,
					// bubble				:	true|false,
					// container			:	String|DOMElement,
					// defaultRoute			:	String,
					// activeClass			:	String,
					// disabledClass		:	String,
					// TransitionManager	:	Class,
					aliases : routes.aliases,
					viewGroups : routes.viewGroups
				});
			}
		});

		});

		return new Site();
	}
);
