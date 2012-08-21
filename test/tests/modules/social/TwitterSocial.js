define([
	"oxblood",
	"red/modules/Module",
	"red/modules/social/TwitterSocial"
], function (OxBlood, Module, TwitterSocial) {
	OxBlood.addModuleTests(function () {

		describe("Module: Twitter Social", function () {

			describe("TwitterSocial", function () {

				var testInstance = new TwitterSocial();

				it("TwitterSocial should be a function", function () {
					expect(TwitterSocial).to.be.a("function");
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
