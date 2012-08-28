define([
	"OxBlood",
	"red/base/Class"
], function (OxBlood, Class) {
	console.log(arguments);

	OxBlood.addCoreTests(function () {

		describe("Rosy Initialization", function () {

			describe(".setup()", function () {

				it("should setup the class if .setup() exists", function (done) {
					var testClass = Class.extend({
						setup : function () {
							this.prototype.isSetup = true;
						}
					});

					var testInstance = new testClass();

					expect(testInstance.isSetup).to.be.ok();
					done();

				});

			});

			describe(".init()", function () {

				it("should run on Class initialization", function (done) {
					var testClass = Class.extend({
						vars : {
							x : 0,
							y : 0,
							z : 0
						},

						init : function () {
							this.vars.x = 2;
							this.vars.y = 3;
							this.vars.b = 4;

							expect(this.vars.x).to.equal(2);
							expect(this.vars.y).to.equal(3);
							expect(this.vars.z).to.equal(0);
							expect(this.vars.b).to.equal(4);

							done();
						}
					});

					var testInstance = new testClass();

				});

			});

			describe(".__init()", function () {

				it("should run before .init()", function (done) {
					var testClass = Class.extend({
						vars : {
							hasRun : false
						},

						__init : function () {
							this.vars.hasRun = true;
							this.init();
						},

						init : function () {
							this.vars.hasRun = false;
						}
					});

					var testExtendClass = testClass.extend({
						init : function () {
							expect(this.vars.hasRun).to.be.ok();
							done();
						}
					});

					var testInstance = new testExtendClass();

				});

			});

		});

	});
});
