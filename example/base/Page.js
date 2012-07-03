// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* page.js */

// Default Page functionality for the "example" website.
// New pages will try to load a specialized class ("Home" for instance),
// if one cannot be found, the site will instantiate this Page by default

define(["../../red/base/Class"], function (Class) {
	return Class.extend({

		// Over-writeable vars, ex: new Page({x:10});
		vars : {
			// example for inheriting and overwriting vars
			x : 1
		},

		// Default page level functionality
		init : function () {
			console.log("init page superclass");
		}

	});
});
