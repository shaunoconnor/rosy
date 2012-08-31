define([
	"OxBlood",
	"red/base/Class",
	"red/modules/Module",
	"red/modules/ticker/Ticker"
], function (OxBlood, Class, Module, Ticker) {
	OxBlood.addModuleTests(function () {

		describe("Module: Ticker", function () {

			describe("Ticker", function () {

				var testOptions = {
					now : new Date(),
					start : new Date(),
					end : "Mon Sep 3 11:45:00 2022"
				};

				var testInstance = new Ticker(testOptions);

				it("Ticker should be a function", function () {
					expect(Ticker).to.be.a("function");
				});

				it("should instantiate the class", function () {
					expect(testInstance).to.be.an("object");
				});

				it("should be an instance of Module", function () {
					expect(testInstance).to.be.a(Module);
				});

				describe("Notifications", function () {

					it("start", function (done) {

						var TestClass = Class.extend({
							vars : {},

							init : function () {
								this.vars.ticker = new Ticker(testOptions);
								this.subscribe("start", this.onStart);
							},

							onStart : function () {
								expect(this.vars.ticker).to.be.a(Ticker);
								this.destroy();

								done();
							}
						});

						var testClassInstance = new TestClass();

					});

					it("tick", function (done) {

						var TestClass = Class.extend({
							vars : {},

							init : function () {
								this.vars.ticker = new Ticker(testOptions);
								this.subscribe("tick", this.onTick);
							},

							onTick : function () {
								expect(this.vars.ticker).to.be.a(Ticker);
								this.destroy();

								done();
							}
						});

						var testClassInstance = new TestClass();

					});

					it("complete", function (done) {

						var TestClass = Class.extend({
							vars : {},

							init : function () {
								this.vars.ticker = new Ticker({
									now : new Date(),
									start : new Date(),
									end : new Date(new Date().setSeconds(new Date().getSeconds() + 1))
								});

								this.subscribe("complete", this.onComplete);
							},

							onComplete : function () {
								expect(this.vars.ticker).to.be.a(Ticker);
								this.destroy();

								done();
							}
						});

						var testClassInstance = new TestClass();

					});
				});

			});

		});

	});
});
