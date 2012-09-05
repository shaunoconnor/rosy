define([
	"OxBlood",
	"./SubClass",
	"$"
], function (OxBlood, SubClass, $) {

	/*global describe, expect, it, before, beforeEach, after, afterEach */

	"use strict";

	OxBlood.addCoreTests(function () {

		describe("jQuery", function () {
			it ("$", function () {
				expect($).to.be.ok();
			});
		});

	});
});
