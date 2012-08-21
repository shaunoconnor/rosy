define(

	[
		"./AbstractClass",
		"../notifications/NotificationManager"
	],

	function (AbstractClass, NotificationManager) {

		"use strict";

		/*================= Function.bind() polyfill =================*/

		if (!Function.prototype.bind) {
			Function.prototype.bind = function (oThis) {
				if (typeof this !== "function") {
					// closest thing possible to the ECMAScript 5 internal IsCallable function
					throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
				}

				var aArgs = Array.prototype.slice.call(arguments, 1),
					fToBind = this,
					FNOP = function () {},
					fBound = function () {
						return fToBind.apply(this instanceof FNOP ? this : oThis || window,
						aArgs.concat(Array.prototype.slice.call(arguments)));
					};

				FNOP.prototype = this.prototype;
				fBound.prototype = new FNOP();
				return fBound;
			};
		}

		/*================= Array.indexOf polyfill =================*/

		Array.prototype.indexOf = Array.prototype.indexOf || function (a, b) {
			if (!this.length || !(this instanceof Array) || arguments.length < 1) {
				return -1;
			}

			b = b || 0;

			if (b >= this.length) {
				return -1;
			}

			while (b < this.length) {
				if (this[b] === a) {
					return b;
				}
				b += 1;
			}
			return -1;
		};

		/*==================================*/

		return AbstractClass.extend({

			init : function (vars, context) {},

			/**
			* Subscribes to a notification.
			*/
			subscribe : function(name, handler, priority) {
				this._interestHandlers = this._interestHandlers || {};

				if (handler && !this._interestHandlers[name]) {
					handler = this.proxy(handler);
					NotificationManager.subscribe(name, handler, priority);
					this._interestHandlers[name] = handler;
				}
			},

			/**
			* Unsubscribes from a notification.
			*/
			unsubscribe : function(name) {
				if (!name) {
					return this.unsubscribeAll();
				}

				if (this._interestHandlers && this._interestHandlers[name]) {
					var handler = this._interestHandlers[name];
					this._interestHandlers[name] = null;
					delete this._interestHandlers[name];
					NotificationManager.unsubscribe(name, handler);
				}
			},

			/**
			* Unsubscribes from all notifications registered via this.subscribe();
			*/
			unsubscribeAll : function() {
				for (var interest in this._interestHandlers) {
					if (this._interestHandlers.hasOwnProperty(interest)) {
						this.unsubscribe(interest);
					}
				}
				this._interestHandlers = [];
			},

			/**
			* Publishes a notification with the specified data.
			*/
			publish : function(name, data, callback) {
				NotificationManager.publish(name, data, callback, this);
			},

			/**
			* Middleware preventDefault method. A shortcut to avoid delegation for a simple task.
			*/
			preventDefault : function (e) {
				e.preventDefault();
			},

			/**
			* Shorthand for func.bind(this)
			* or rather, $.proxy(func, this) in jQuery terms
			*/
			proxy : function (fn) {

				if ($ && $.proxy) {
					return $.proxy(fn, this);
				}

				return fn ? fn.bind(this) : fn;
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
				this.unsubscribe();
			}
		});
	}
);