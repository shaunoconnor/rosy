define(["../dom/DOMClass"], function (DOMClass) {

	// Extend Class
	return DOMClass.extend({

		destroy : function () {
			this.sup();
		}

	});
});
