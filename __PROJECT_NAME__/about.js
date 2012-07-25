// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* about.js */

// About Page specific instance
define(["./base/Page"], function (Page) {

	return Page.extend({

		// Over-writeable vars, ex:
		//
		//  var foo = new Page({
		//      x : 10
		//  });
		vars : {
			x : 100,
			y : 3,
			z : 4
		},

		// About  page level functionality
		init : function (vars) {}

	});
});
