define([
	"OxBlood",
	"./SubClass"
], function (OxBlood, SubClass) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Scope", function () {
			describe("scope", function () {
				afterEach(function () {
					$("body").off();
				});

				it ("should report 'this' as Class without .proxy()", function (done) {
					var TestClass = SubClass.extend({
						init : function () {
							this.setupEvents();
						},

						setupEvents : function () {
							var body = $("body");

							body.on({
								click : this.onClick,
								scroll : this.onScroll
							});

							this.setTimeout(function () {
								body.trigger("click");
								body.trigger("scroll");
							}, 0);
						},

						onClick : function () {
							expect(this).to.eql(testInstance);
						},

						onScroll : function () {
							expect(this).to.eql(testInstance);
							done();
						}
					});

					var testInstance = new TestClass();
					expect(testInstance).to.be.a(TestClass);
				});

				it("should respect autoProxy option", function (done) {
					var TestClass = SubClass.extend({
						opts : {
							autoProxy : false
						},

						init : function () {
							this.setupEvents();
						},

						setupEvents : function () {
							var body = $("body");

							body.on({
								click : this.onClick,
								scroll : this.onScroll
							});

							this.setTimeout(function () {
								body.trigger("click");
								body.trigger("scroll");
							}, 0);
						},

						onClick : function () {
							expect(this).to.not.eql(testInstance);
						},

						onScroll : function () {
							expect(this).to.not.eql(testInstance);
							done();
						}
					});

					var testInstance = new TestClass();
					expect(testInstance).to.be.a(TestClass);
				});
			});

			describe(".proxy()", function () {
				var TestClass = SubClass.extend({
					opts : {
						autoProxy : false
					}
				});

				var testInstance = new TestClass();

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
