/*jshint es5:true*/

define([
	"OxBlood",
	"project/base/Page"
], function (OxBlood, Page) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Notifications", function () {
			var testInstance = new Page();

			describe(".subscribe()", function () {

				it("subscribe should be a function", function () {
					expect(testInstance.subscribe).to.be.a("function");
				});

				it("should subscribe to a notification", function (done) {
					testInstance.subscribe("sub-test", function () {
						done();
					});

					testInstance.publish("sub-test");
				});

			});

			describe(".unsubscribe()", function () {

				it("unsubscribe should be a function", function () {
					expect(testInstance.unsubscribe).to.be.a("function");
				});

				it("should unsubscribe a notification", function (done) {
					testInstance.subscribe("unsub-test", function () {
						done("ERROR!");
					});

					testInstance.unsubscribe("unsub-test");
					testInstance.publish("unsub-test");

					done();
				});

			});

			describe(".publish()", function () {

				it("publish should be a function", function () {
					expect(testInstance.publish).to.be.a("function");
				});

				it("should publish a notification", function (done) {
					testInstance.subscribe("pub-test", function () {
						done();
					});

					testInstance.publish("pub-test");
				});

			});

		});

	});
});
