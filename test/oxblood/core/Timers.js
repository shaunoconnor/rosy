define([
	"OxBlood",
	"red/base/Class"
], function (OxBlood, Class) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Timers", function () {
			var testInstance = new Class();
			var delay = 10;

			describe(".setTimeout()", function () {
				var doneFired;

				it("should delay a function", function (done) {
					testInstance.setTimeout(function () {
						doneFired = true;
						done();
					}, delay);

					window.setTimeout(function () {
						if (!doneFired) {
							done(false);
						}
					}, delay + 1);
				});

				it("should report scope as itself", function (done) {
					testInstance.setTimeout(function () {
						expect(this).to.eql(testInstance);
						done();
					}, delay);
				});
			});

			describe(".setInterval()", function () {
				var testInterval;
				var winInterval;

				it("should fire a function at an interval", function (done) {
					testInterval = testInstance.setInterval(function () {
						window.clearInterval(testInterval);
						window.clearInterval(winInterval);

						done();
					}, delay);

					winInterval = window.setInterval(function () {
						window.clearInterval(testInterval);
						window.clearInterval(winInterval);

						done(false);
					}, delay * 2);
				});

				it("should report scope as itself", function (done) {
					testInterval = testInstance.setInterval(function () {
						expect(this).to.eql(testInstance);
						window.clearInterval(testInterval);

						done();
					}, delay);
				});
			});

		});

	});
});
