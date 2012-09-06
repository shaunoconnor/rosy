(function () {

	/*global require, define */

	"use strict";

	require.config({
		shim : {
			"rosy/modules/scroller/zynga/src/Raf" : ["rosy/modules/scroller/zynga/src/Scroller"],
			"rosy/modules/scroller/zynga/src/Animate" : ["rosy/modules/scroller/zynga/src/Raf"]
		}
	});

	define([
			"./src/Scroller",
			"./src/Raf",
			"./src/Animate"
		], function () {
			return window.Scroller;
		}
	);
}());
