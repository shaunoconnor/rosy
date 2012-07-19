define(

	function () {
	
		"use strict";

		/*=========================== HELPER FUNCTIONS ===========================*/

			var _copyTo = function (obj) {
				while(arguments.length > 1) {
					var prop, obj2 = Array.prototype.splice.call(arguments, 1, 1)[0];					

					for (prop in obj2) {						
						if (typeof obj2[prop] === "object") {
							obj[prop] = _copyTo({}, obj2[prop]);
						}
						else {
							obj[prop] = obj2[prop];
						}
					}
				}
				return obj;
			};

			var _createSuperFunction = function (fn, superFn) {
				return function() {
					var r, tmp = this.sup || null;

					// Reference the prototypes method, as super temporarily
					this.sup = superFn;

					r = fn.apply(this, arguments);

					// Reset this.sup
					this.sup = tmp;
					return r;
				};
			};

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
					if (typeof func === "function" && typeof sup[name] === "function" && _doesCallSuper.test(func)) {
						func = _createSuperFunction(func, sup[name]);
					}

					prototype[name] = func;
				}
			}

			prototype.vars = _copyTo({}, this.prototype.vars, prototype.vars); // inherit vars

			// The dummy class constructor
			function SubClass(vars) {

				this.vars = _copyTo({}, this.vars, vars); // override this.vars object with passed argument
				
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
				_copyTo(SubClass, events);
			}

			return SubClass;
		};

		Class.extend = extend;

		return Class;
	}
);