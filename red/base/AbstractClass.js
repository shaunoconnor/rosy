define(

	[
		"../utils/Utils"
	],

	function (Utils) {

		"use strict";

		/*=========================== HELPER FUNCTIONS ===========================*/

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

		return (function() {

			// Setup a dummy constructor for prototype-chaining without any overhead.
			var Dummy = function () {};
			var MClass = function () {};

			MClass.extend = function (props, staticProps) {

				Dummy.prototype = this.prototype;
				var p, proto = Utils.extend(new Dummy(), props);

				function Class (vars) {

					/**
					* If the prototype has a vars object and the first argument, is an object,
					* deep copy it to this.vars
					**/
					if (this.vars && typeof vars === "object") {
						Utils.extend(this.vars, true, vars);
					}

					var fn = this.init || this.prototype.constructor;
					return fn.apply(this, arguments);
				}

				for (p in props) {
					if (
						p !== "static" &&
						typeof props[p] === "function" &&
						typeof this.prototype[p] === "function" &&
						_doesCallSuper.test(props[p])
					) {
						// this.sup() magic, on an as-needed
						proto[p] = _createSuperFunction(props[p], this.prototype[p]);
					}

					else if (typeof props[p] === "object") {

						if (props[p] instanceof Array) {
							proto[p] = props[p].concat();
						}

						else if (props[p] !== null) {
							proto[p] = Utils.extend({}, (p === "vars"), props[p]);
						}
					}
				}

				Class.prototype = proto;

				Utils.extend(Class, this, props.static, staticProps);

				Class.prototype.constructor = Class.prototype.static = Class;

				if (typeof Class.prototype.setup === "function") {
					Class.prototype.setup();
				}

				return Class;
			};

			return MClass;

		}());
	}
);