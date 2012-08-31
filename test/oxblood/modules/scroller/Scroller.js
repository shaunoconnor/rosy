define([
	"OxBlood",
	"red/base/Class",
	"red/modules/Module",
	"red/modules/scroller/Scroller"
], function (OxBlood, Class, Module, Scroller) {
	OxBlood.addModuleTests(function () {

		describe("Module: Scroller", function () {

			describe("Scroller", function () {

				var doc = $(document);
				var dummyTarget = $("<div><div></div></div>");

				var testInstance = new Scroller({
					target : dummyTarget
				});

				it("Scroller should be a function", function () {
					expect(Scroller).to.be.a("function");
				});

				it("should instantiate the class", function () {
					expect(testInstance).to.be.an("object");
				});

				it("should be an instance of Module", function () {
					expect(testInstance).to.be.a(Module);
				});

				describe("Notifications", function () {
					var TestClass = Class.extend({
						vars : {},

						init : function () {
							this.vars.scroller = new Scroller({
								target : dummyTarget
							});

							this.setupNotifications();
							this.testScroller();
						},

						setupNotifications : function () {
							var scroller = this.vars.scroller;
						},

						testScroller : function () {}
					});

					it(Scroller.TOUCHSTART, function (done) {
						var StartClass = TestClass.extend({
							setupNotifications : function () {
								this.sup();
								this.subscribe(Scroller.TOUCHSTART, this.onTouchStart);
							},

							onTouchStart : function (n) {
								expect(n.dispatcher).to.be.a(Scroller);
								expect(n.name).to.equal(Scroller.TOUCHSTART);
								expect(n.data.target).to.equal(dummyTarget.get(0));

								this.unsubscribeAll();
								this.vars.scroller.destroy();

								this.vars.done();
							},

							testScroller : function () {
								this.vars.done = done;

								if ("ontouchstart" in window) {
									var e = $.Event("touchstart", {
										touches : []
									});

									dummyTarget.trigger("touchstart", e);
								} else {
									dummyTarget.trigger("mousedown");
								}

								this.sup();
							}
						});

						var startInstance = new StartClass();
					});

					it(Scroller.TOUCHMOVE, function (done) {
						var StartClass = TestClass.extend({
							setupNotifications : function () {
								this.sup();
								this.subscribe(Scroller.TOUCHMOVE, this.onTouchMove);
							},

							onTouchMove : function (n) {
								expect(n.dispatcher).to.be.a(Scroller);
								expect(n.name).to.equal(Scroller.TOUCHMOVE);

								this.unsubscribeAll();
								this.vars.scroller.destroy();

								this.vars.done();
							},

							testScroller : function () {
								this.vars.done = done;

								if ("ontouchstart" in window) {
									doc.trigger("touchmove");
								} else {
									dummyTarget.trigger("mousedown");
									doc.trigger("mousemove");
								}

								this.sup();
							}
						});

						var startInstance = new StartClass();
					});

					it(Scroller.TOUCHEND, function (done) {
						var StartClass = TestClass.extend({
							setupNotifications : function () {
								this.sup();
								this.subscribe(Scroller.TOUCHEND, this.onTouchEnd);
							},

							onTouchEnd : function (n) {
								expect(n.dispatcher).to.be.a(Scroller);
								expect(n.name).to.equal(Scroller.TOUCHEND);

								this.unsubscribeAll();
								this.vars.scroller.destroy();

								this.vars.done();
							},

							testScroller : function () {
								this.vars.done = done;

								if ("ontouchstart" in window) {
									doc.trigger("touchend");
								} else {
									dummyTarget.trigger("mousedown");
									doc.trigger("mouseup");
								}

								this.sup();
							}
						});

						var startInstance = new StartClass();
					});
				});

			});

		});

	});
});
