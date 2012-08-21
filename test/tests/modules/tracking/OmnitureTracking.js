define([
	"oxblood",
	"red/modules/Module",
	"red/modules/tracking/OmnitureTracking"
], function (OxBlood, Module, OmnitureTracking) {
	OxBlood.addModuleTests(function () {

		describe("Module: Omniture Tracking", function () {

			describe("OmnitureTracking", function () {

				var testInstance = new OmnitureTracking();

				it("OmnitureTracking should be a function", function () {
					expect(OmnitureTracking).to.be.a("function");
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
