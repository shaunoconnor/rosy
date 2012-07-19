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

		return (function() {

			// Setup a dummy constructor for prototype-chaining without any overhead.
			var dummy = function () {};
			var MClass = function () {};

			MClass.extend = function (props, staticProps) {

				dummy.prototype = this.prototype;
				var p, proto = _copyTo(new dummy(), props);

				function Class (opts) {

					/**
					* If USE_OPTS is true, and the first argument, is an object,
					* deep copy it to this.opts
					**/
					if (this.opts && this.opts.USE_OPTS && typeof opts === "object") {
						_copyTo(this.opts, opts);
					}

					var fn = this.init || this.prototype.constructor;
					return fn.apply(this, arguments);
				}

				for (p in props) {
					if (
						p !== "static" 
						&& typeof props[p] === "function" 
						&& typeof this.prototype[p] === "function" 
						&& _doesCallSuper.test(props[p])
					) {
						// this.sup() magic, on an as-needed
						proto[p] = _createSuperFunction(props[p], this.prototype[p]);
					}

					else if (typeof props[p] === "object") {

						if (props[p] instanceof Array) {
							proto[p] = props[p].concat();
						}

						else {
							proto[p] = _copyTo({}, props[p]);	
						}
					}
				}

				Class.prototype = proto;

				_copyTo(Class, this, props.static, staticProps);

				Class.prototype.constructor = Class.prototype.static = Class;

				if (typeof Class.prototype.setup == "function") {
					Class.prototype.setup();
				}

				return Class;
			};
			
			return MClass;

		})();
	}
);