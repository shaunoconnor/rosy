/*jshint es5:true*/

define([
	"OxBlood",
	"project/site"
], function (OxBlood, Site) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Notifications", function () {

			describe(".subscribe()", function () {

				it("subscribe should be a function", function () {
					expect(Site.subscribe).to.be.a("function");
				});

				it("should subscribe to a notification", function (done) {
					Site.subscribe("sub-test", function () {
						done();
					});

					Site.publish("sub-test");
				});

			});

			describe(".unsubscribe()", function () {

				it("unsubscribe should be a function", function () {
					expect(Site.unsubscribe).to.be.a("function");
				});

				it("should unsubscribe a notification", function (done) {
					Site.subscribe("unsub-test", function () {
						done("ERROR!");
					});

					Site.unsubscribe("unsub-test");
					Site.publish("unsub-test");

					done();
				});

			});

			describe(".publish()", function () {

				it("publish should be a function", function () {
					expect(Site.publish).to.be.a("function");
				});

				it("should publish a notification", function (done) {
					Site.subscribe("pub-test", function () {
						done();
					});

					Site.publish("pub-test");
				});

			});

		});

	});
});
