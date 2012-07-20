define(

	[
		"./AbstractClass",
		"jquery",
		"$!pubsub"
	],

	function (AbstractClass, $) {


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
				fNOP = function () {},
				fBound = function () {
					return fToBind.apply(this instanceof fNOP ? this : oThis || window,
					aArgs.concat(Array.prototype.slice.call(arguments)));
				};

				fNOP.prototype = this.prototype;
				fBound.prototype = new fNOP();
				return fBound;
			};
		}

		/*==================================*/

		return AbstractClass.extend({

			namespace : null,

			vars : {
				subs : {},
				USE_VARS: true
			},

			init : function (vars, context) {},

			getUniqueId : function () {
				var name = this.namespace || "";
				return [name, Math.floor(Math.random() * 9999999)].join("/");
			},

			scopeNotification : function (name) {
				this.uid = this.uid || this.getUniqueId();
				return name + "." + this.uid;
			},

			publish : function (name, args) {
				return $.publish(name, args);
			},

			subscribe : function (name, func) {
				name = this.scopeNotification(name);

				this.vars.subs[name] = this.vars.subs[name] || [];
				this.vars.subs[name].push(func);

				return $.subscribe(name, func);
			},

			unsubscribe : function (name, func) {
				var group, key, i, j;

				if (!name && !func) {
					for (key in this.vars.subs) {
						if (this.vars.subs.hasOwnProperty(key)) {
							for (i = 0, j = this.vars.subs[key].length; i < j; i++) {
								$.unsubscribe(key, this.vars.subs[key][i]);
							}
							this.vars.subs[key] = null;
						}
					}

					delete this.vars.subs;
				} else if (name) {
					name = this.scopeNotification(name);
					group = this.vars.subs[name];

					if (group) {
						for (i = 0, j = group.length; i < j; i++) {
							if (!func || group[i] === func) {
								group[i] = null;
							}
						}
					}

					return $.unsubscribe(name, func);
				}
			},

			// Middleware preventDefault method. A shortcut to avoid delegation for a simple task.
			preventDefault : function (e) {
				e.preventDefault();
			},

			/** 
			* Shorthand for func.bind(this)
			* or rather, $.proxy(func, this) in jQuery terms
			*/
			proxy : function (fn) {
				return fn ? fn.bind(this) : fn;
			},

			// Middleware setTimeout method. Allows for scope retention inside timers.
			setTimeout : function (func, delay) {
				return window.setTimeout(this.proxy(func), delay);
			},

			destroy : function () {
				this.unsubscribe();
			}
		});
	}
);