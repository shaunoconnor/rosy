define([
	"OxBlood",
	"./SubClass",
	"$",
	"$plugin!easing"
], function (OxBlood, SubClass, $) {

	/*global describe, expect, it, before, beforeEach, after, afterEach */

	"use strict";

	OxBlood.addCoreTests(function () {

		describe("jQuery", function () {
			it ("$", function () {
				expect($).to.be.ok();
			});

			describe("jQuery Plugins", function () {

				it("$.easing", function () {
					expect($.easing).to.be.ok();
				});

			});
		});

	});
});
