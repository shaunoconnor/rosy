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

			/**
			* Middleware setTimeout method. Allows for scope retention inside timers.
			*/
			setTimeout : function (func, delay) {
				return window.setTimeout(this.proxy(func), delay);
			},

			/**
			* Middleware setInterval method. Allows for scope retention inside timers.
			*/
			setInterval : function (func, delay) {
				return window.setInterval(this.proxy(func), delay);
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
