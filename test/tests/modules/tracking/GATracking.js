define([
	"oxblood",
	"red/modules/Module",
	"red/modules/tracking/GATracking"
], function (OxBlood, Module, GATracking) {
	OxBlood.addModuleTests(function () {

		describe("Module: Google Analytics Tracking", function () {

			describe("GATracking", function () {

				var testInstance = new GATracking();

				it("GATracking should be a function", function () {
					expect(GATracking).to.be.a("function");
				});

				it("should instantiate the class", function () {
					expect(testInstance).to.be.an("object");
				});

				it("should be an instance of Module", function () {
					expect(testInstance).to.be.an["instanceof"](Module);
				});

			});

		});

	});
});
