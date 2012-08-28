define([
	"OxBlood",
	"red/base/Class",
	"./SubClass"
], function (OxBlood, Class, SubClass) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Teardown", function () {

			describe("Class Destruction", function () {

				it("should teardown the created Class", function (done) {
					var testClass = SubClass.extend({
						vars : {
							x : 1,
							y : 2,
							z : 3
						},

						init : function () {
							this.vars.initialized = true;
						},

						destroy : function () {
							for (var key in this.vars) {
								delete this.vars[key];
							}

							expect(this.vars.x).to.not.be.ok();
							expect(this.vars.y).to.not.be.ok();
							expect(this.vars.z).to.not.be.ok();
							expect(this.vars.initialized).to.not.be.ok();

							done();
						}
					});

					var testInstance = new testClass();

					expect(testInstance).to.be.a(SubClass);
					expect(testInstance).to.be.a(Class);

					testInstance.destroy();
				});

				it("should unsubscribe all notifications", function (done) {
					var testClass = SubClass.extend({

						vars : {
							x : 0
						},

						init : function () {
							this.subscribe("test-1", function () {
								this.vars.x = 1;
							});
							this.subscribe("test-2", function () {
								this.vars.y = 2;
							});
							this.subscribe("test-3", function () {
								this.vars.z = 3;
							});
						},

						destroy : function () {
							this.sup();

							this.publish("test-1");
							this.publish("test-2");
							this.publish("test-3");

							expect(this.vars.x).to.not.be.ok();
							expect(this.vars.y).to.not.be.ok();
							expect(this.vars.z).to.not.be.ok();

							done();
						}
					});

					var testInstance = new testClass();

					expect(testInstance).to.be.a(SubClass);
					expect(testInstance).to.be.a(Class);
					
					testInstance.destroy();
				});

			});

		});

	});
});
