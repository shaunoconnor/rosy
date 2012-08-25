define([
	"OxBlood",
	"project/base/Page"
], function (OxBlood, Page) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Setup", function () {

			describe(".setup()", function () {

				it("should setup the class if .setup() exists", function (done) {
					var testPage = Page.extend({
						setup : function () {
							this.prototype.vars.isSetup = true;
						}
					});

					var testInstance = new Page();

					expect(testInstance.vars.isSetup).to.be.ok();
					done();

				});

			});

		});

	});
});
