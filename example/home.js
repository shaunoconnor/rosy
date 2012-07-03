// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* home.js */

// Home Page class
define(["./base/Page"], function(Page){

	// Extends example.Page
	return Page.extend({

		// Over-writeable vars, ex:
		//
		//  var foo = new Page({
		//      x : 10
		//  });
		vars : {
			// Results in `{ x : 1, y : 2 }` by inheriting from `example.Page`
			z : 3
		},

		// Home  page level functionality
		init : function () {
			console.log('init home page');
		}

	});
});
