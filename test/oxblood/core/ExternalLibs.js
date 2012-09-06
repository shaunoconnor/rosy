define([
	"OxBlood",
	"./SubClass",
	"Handlebars",
	"$",
	"libs/json3"
], function (OxBlood, SubClass, Handlebars, $) {

	/*global Modernizr, describe, expect, it, before, beforeEach, after, afterEach */

	"use strict";

	OxBlood.addCoreTests(function () {

		describe("External Library Dependencies", function () {
			it("Modernizr", function () {
				expect(Modernizr).to.be.ok();
			});

			it("JSON3", function () {
				expect(JSON).to.be.ok();
			});

			it("Handlebars", function () {
				expect(Handlebars).to.be.ok();
			});

			it("$", function () {
				expect($).to.be.ok();
			});
		});

	});
});
