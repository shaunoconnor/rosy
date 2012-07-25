// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* home.js */

// Home Page class
define(["./base/Page"], function (Page) {

	return Page.extend({

		vars : {
			z : 3
		},

		// Home  page level functionality
		init : function () {
			console.log('init home page');
		}

	});
});
