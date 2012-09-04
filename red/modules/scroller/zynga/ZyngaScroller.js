(function () {

	/*global require, define */

	"use strict";

	require.config({
		shim : {
			"red/modules/scroller/zynga/src/Raf" : ["red/modules/scroller/zynga/src/Scroller"],
			"red/modules/scroller/zynga/src/Animate" : ["red/modules/scroller/zynga/src/Raf"]
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
