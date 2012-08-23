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
							this.vars.isSetup = true;
							expect(this.vars.isSetup).to.be(true);

							done();
						}
					});

					var testInstance = new Page();
					expect(testInstance.setup).to.be.a("function");
				});

			});

		});

	});
});
