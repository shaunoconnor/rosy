define([
	"OxBlood",
	"rosy/modules/Module",
	"rosy/modules/google-chrome-frame/ChromeFrame",
	"Cookies",
	"$"
], function (OxBlood, Module, ChromeFrame, Cookies, $) {

	/*global describe, expect, it, before, beforeEach, after, afterEach */

	"use strict";

	OxBlood.addModuleTests(function () {

		describe("Module: Google Chrome Frame", function () {

			describe("ChromeFrame", function () {

				var testInstance;

				beforeEach(function () {
					testInstance = new ChromeFrame();
				});

				afterEach(function () {
					Cookies.expire(ChromeFrame.COOKIE_NAME);
					testInstance.destroy();
				});

				it("ChromeFrame should be a function", function () {
					expect(ChromeFrame).to.be.a("function");
				});

				it("should instantiate the class", function () {
					expect(testInstance).to.be.an("object");
				});

				it("should be an instance of Module", function () {
					expect(testInstance).to.be.a(Module);
				});

			});

			describe("IE Specific", function () {
				var ChildChromeFrame = ChromeFrame.extend({
					onClickNo : function (e, done) {
						this.sup(e);

						if (done) {
							done();
						}
					},

					onClickYes : function (e, done) {
						e.preventDefault();

						if (done) {
							done();
						}
					},

					onClickAlt : function (e, done) {
						e.preventDefault();

						if (done) {
							done();
						}
					}
				});

				var testInstance;

				beforeEach(function () {
					testInstance = new ChildChromeFrame();
				});

				afterEach(function () {
					Cookies.expire(ChromeFrame.COOKIE_NAME);
					testInstance.destroy();
				});

				if (!$.browser.msie) {
					it("should not report as Internet Explorer", function () {
						expect($.browser.msie).to.not.be.ok();
					});
				} else {
					it("should setup CFInstall when no Chrome Frame is detected", function () {
						expect(testInstance.vars.frame.hasClass("hidden")).to.not.be.ok();
					});

					it ("should append #chrome-frame to DOM", function () {
						expect($("#chrome-frame").length).to.be.ok();
					});

					it("should fire event on #cf-approve click", function (done) {
						testInstance.vars.yes.trigger("click");
						done();
					});

					it("should fire event on #cf-decline click", function (done) {
						testInstance.vars.no.trigger("click", done);
					});

					it("should set a cookie on #cf-decline click", function () {
						testInstance.vars.no.trigger("click");
						expect(Cookies.get(ChromeFrame.COOKIE_NAME)).to.be.ok();
					});

					it("should fire event on #browsers a click", function (done) {
						testInstance.vars.alts.eq(0).trigger("click", done);
					});
				}
			});

		});
	});
});
