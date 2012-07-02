// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* shell.js */

// Site shell object
define(["./base/Page"], function(Page){
	return Page.extend({
		vars : {},
		
		init : function () {
			this.setupHeader();
			this.setupFooter();
			
			this.sup();
		},

		setupHeader : function () {
			console.log("setup header!");
		},
		
		setupFooter : function () {
			console.log("setup footer!");
		}
	});
});
