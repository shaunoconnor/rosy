define(["../dom/DOMClass"], function (DOMClass) {

	"use strict";

	// Extend Class
	return DOMClass.extend({

		destroy : function () {
			this.sup();
		}

	});
});
