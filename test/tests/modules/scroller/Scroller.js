define([
	"OxBlood",
	"red/modules/Module",
	"red/modules/scroller/Scroller"
], function (OxBlood, Module, Scroller) {
	OxBlood.addModuleTests(function () {

		describe("Module: Scroller", function () {

			describe("Scroller", function () {

				var testInstance = new Scroller({
					target : $("<div><div></div></div>")
				});

				it("Scroller should be a function", function () {
					expect(Scroller).to.be.a("function");
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
