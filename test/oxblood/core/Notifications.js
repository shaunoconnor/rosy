/*jshint es5:true*/

define([
	"OxBlood",
	"project/base/Page"
], function (OxBlood, Page) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Notifications", function () {
			var delay = 10;

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

				it("should publish a notification with data", function (done) {
					testInstance.subscribe("pub-data-test", function (notification) {
						expect(notification.data).to.deep.equal({
							x : 1,
							y : 2
						});

						done();
					});

					testInstance.publish("pub-data-test", {
						x : 1,
						y : 2
					});
				});

			});

			describe(".hold()", function () {
				var holdInstance = new Page();
				var doneCalled;

				it("should hold a notification", function (done) {
					testInstance.subscribe("hold-test", function (notification) {
						notification.hold();

						window.setTimeout(function () {
							notification.release();
						}, delay);

						doneCalled = true;
						done();
					});

					holdInstance.subscribe("hold-test", function (notification) {
						if (!doneCalled) {
							done(false);
						}
					});

					testInstance.publish("hold-test");
				});

			});

			describe(".release()", function () {
				var releaseInstance = new Page();
				var doneCalled;

				it("should release a notification", function (done) {
					testInstance.subscribe("release-test", function (notification) {
						notification.hold();

						window.setTimeout(function () {
							notification.release();

							if (!doneCalled) {
								done(false);
							}
						}, delay);
					});

					releaseInstance.subscribe("release-test", function (notification) {
						doneCalled = true;
						done();
					});

					testInstance.publish("release-test");
				});

			});

			describe(".cancel()", function () {
				var cancelInstance = new Page();

				it("should cancel a notification", function (done) {
					testInstance.subscribe("cancel-test", function (notification) {
						notification.cancel();

						window.setTimeout(function () {
							done();
						}, delay);
					});

					cancelInstance.subscribe("cancel-test", function (notification) {
						done(false);
					});

					testInstance.publish("cancel-test");
				});
			});

			describe(".respond()", function () {
				it("should respond to a notification with a callback", function (done) {
					testInstance.subscribe("respond-test", function (notification) {
						expect(notification).to.be.an("object");

						notification.respond({
							x : 1,
							y : 2
						});
					});

					testInstance.publish("respond-test", {}, function (obj) {
						expect(obj).to.deep.equal({
							x : 1,
							y : 2
						});

						done();
					});
				});
			});

			describe("n.dispatcher", function () {
				it("should report the current target", function () {
					testInstance.subscribe("dispatcher-test", function (notification) {
						expect(notification.dispatcher).to.be.an("object");
						expect(notification.dispatcher).to.deep.equal(testInstance);
					});

					testInstance.publish("dispatcher-test");
				});
			});

		});

	});
});
