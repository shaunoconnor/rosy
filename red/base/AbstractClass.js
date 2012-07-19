define(

	function () {
	
		"use strict";

		/*=========================== HELPER FUNCTIONS ===========================*/

			/*
			If Function.toString() works as expected, return a regex that checks for `sup()`
			otherwise return a regex that passes everything.
			*/

			var _doesCallSuper = /xyz/.test(function(){var xyz;}) ? /\bthis\.sup\b/ : /.*/;

		/*=========================== END OF HELPER FUNCTIONS ===========================*/

		var initializing = false;

		// The base Class implementation (does nothing)
		var Class = function () {};

		// Create a new Class that inherits from this class
		function extend(prop, events) {
			var sup = this.prototype,
				This = this,
				prototype, name, tmp, ret, func;

			// Instantiate a base class (but only create the instance,
			// don't run the init constructor)
			initializing = true;
			prototype = new This();
			initializing = false;

			// Copy the properties over onto the new prototype
			for (name in prop) {
				if (prop.hasOwnProperty(name)) {
					func = prop[name];

					// Check if we're overwriting an existing function
					prototype[name] = (typeof func === "function") && (typeof sup[name] === "function") && _doesCallSuper.test(func) ? (function (name, fn) {
						return function () {
							tmp = this.sup;

							// Add a new .sup() method that is the same method
							// but on the super-class
							this.sup = sup[name];

							// The method only need to be bound temporarily, so we
							// remove it when we're done executing
							ret = fn.apply(this, arguments);
							this.sup = tmp;

							return ret;
						};
					}(name, func)) : func;
				}
			}

			prototype.vars = $.extend(true, {}, this.prototype.vars, prototype.vars); // inherit vars

			// The dummy class constructor
			function SubClass(vars) {

				this.vars = $.extend(true, {}, this.vars, vars); // override this.vars object with passed argument
				
				// All construction is actually done in the init method
				if (!initializing && this.init) {
					this.init.apply(this, arguments);
				}
			}

			// Populate our constructed prototype object
			SubClass.prototype = prototype;

			// Enforce the constructor to be what we expect
			SubClass.constructor = SubClass;

			// And make this class extendable
			SubClass.extend = extend;

			if (typeof events === 'object') {
				$.extend(SubClass, events);
			}

			return SubClass;
		};

		Class.extend = extend;

		return Class;
	}
);