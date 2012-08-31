define(

	[
		"../base/Class",
		"./DOMManager"
	],

	function (Class, DOMManager) {

		"use strict";

		return Class.extend({

			destroy : function () {
				if (DOMManager) {
					DOMManager.unbindEvents(this);
				}

				this.sup();
			}
		});
	}
);
