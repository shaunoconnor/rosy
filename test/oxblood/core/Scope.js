define([
	"OxBlood",
	"red/base/Class"
], function (OxBlood, Class) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Scope", function () {
			var testInstance = new Class();

			describe(".proxy()", function () {

				it("proxy should be a function", function () {
					expect(testInstance.proxy).to.be.a("function");
				});

				it("should report scope as itself", function (done) {
					testInstance.proxy(function () {
						expect(this).to.eql(testInstance);
						done();
					})();
				});

			});

		});

	});
});
