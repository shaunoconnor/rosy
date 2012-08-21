define([
	"oxblood",
	"project/site"
], function (OxBlood, Site) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Scope", function () {

			describe(".proxy()", function () {

				it("proxy should be a function", function () {
					expect(Site.proxy).to.be.a("function");
				});

				it("should report scope as itself", function (done) {
					Site.proxy(function () {
						expect(this).to.equal(Site);
						done();
					})();
				});

			});

		});

	});
});
