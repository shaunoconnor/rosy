define([
	"OxBlood",
	"red/modules/Module",
	"red/modules/social/FacebookSocial"
], function (OxBlood, Module, FacebookSocial) {
	OxBlood.addModuleTests(function () {

		describe("Module: Facebook Social", function () {

			describe("FacebookSocial", function () {

				var testInstance = new FacebookSocial();

				it("FacebookSocial should be a function", function () {
					expect(FacebookSocial).to.be.a("function");
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
