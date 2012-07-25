// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* page.js */

// Default Page functionality for the "__PROJECT_NAME__" website.
// New pages will try to load a specialized class ("Home" for instance),
// if one cannot be found, the site will instantiate this Page by default

define(["red/base/Class"], function (Class) {
	return Class.extend({

		vars : {
			x : 1
		},

		init : function () {
			console.log("init page superclass");
		}

	});
});
