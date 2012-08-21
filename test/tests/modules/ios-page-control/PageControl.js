define([
	"oxblood",
	"red/modules/Module",
	"red/modules/ios-page-control/PageControl"
], function (OxBlood, Module, PageControl) {
	OxBlood.addModuleTests(function () {

		describe("Module: iOS Page Controller", function () {

			var testInstance = new PageControl({
				parent : $("<div>"),
				list : $("<div>"),
				items : $("<div>")
			});

			describe("PageControl", function () {

				it("PageControl should be a function", function () {
					expect(PageControl).to.be.a("function");
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
