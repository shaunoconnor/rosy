define([
	"OxBlood",
	"./SubClass"
], function (OxBlood, SubClass) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Setup", function () {

			describe(".setup()", function () {

				it("should setup the class if .setup() exists", function (done) {
					var testPage = SubClass.extend({
						setup : function () {
							this.prototype.isSetup = true;
						}
					});

					var testInstance = new SubClass();

					expect(testInstance.isSetup).to.be.ok();
					done();

				});

			});

		});

	});
});
