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
			* Middleware preventDefault method. A shortcut to avoid delegation for a simple task.
			*/
			preventDefault : function (e) {
				e.preventDefault();
			},

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
