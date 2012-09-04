define(

	[
		"../base/Class",
		"./DOMManager",
		"$"
	],

	function (Class, DOMManager, $) {

		"use strict";

		return Class.extend({

			/**
			* Shorthand for $.proxy(func, this)
			*/
			proxy : function (fn) {
				return $.proxy(fn, this);
			},

			destroy : function () {
				if (DOMManager) {
					DOMManager.unbindEvents(this);
				}

				this.sup();
			}
		});
	}
);
