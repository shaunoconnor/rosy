define([
	"oxblood",
	"red/modules/Module",
	"red/modules/ticker/Ticker"
], function (OxBlood, Module, Ticker) {
	OxBlood.addModuleTests(function () {

		describe("Module: Ticker", function () {

			describe("Ticker", function () {

				var testInstance = new Ticker();

				it("Ticker should be a function", function () {
					expect(Ticker).to.be.a("function");
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
