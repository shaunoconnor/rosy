define([
	"OxBlood",
	"./SubClass"
], function (OxBlood, SubClass) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Inheritance", function () {

			describe("SubClass Inheritance", function () {

				it("should create an instance of SubClass", function () {
					expect(new SubClass()).to.be.a(SubClass);
				});

				it("should contain vars.x with a value of 1", function () {
					var Foo = SubClass.extend({
						vars : {
							x : 1
						}
					});

					expect(new Foo().vars.x).to.equal(1);
				});

				it("should contain scoped vars.x values", function () {
					var Foo = SubClass.extend({
						vars : {
							x : 1
						}
					});

					var Bar = Foo.extend({
						vars : {
							x : 2
						}
					});

					var foo = new Foo();
					var bar = new Bar();

					expect(foo.vars.x).to.equal(1);
					expect(bar.vars.x).to.equal(2);

					bar.vars.x = 3;
					expect(foo.vars.x).to.equal(1);
				});

				describe("Deep Copying", function () {

					var Foo = SubClass.extend({
						vars : {
							y : {
								a: 1,
								b: 2,
								c: [0, 1, 2]
							}
						}
					});

					var Bar = Foo.extend({
						vars : {
							y : {
								a: 3,
								b: 4,
								c: [5, 6, 7]
							}
						}
					});

					var foo = new Foo();
					var bar = new Bar();

					it("should deep copy objects", function () {
						expect(foo.vars.y.a).to.equal(1);
						expect(foo.vars.y.b).to.equal(2);
						expect(foo.vars.y.c[1]).to.equal(1);

						expect(bar.vars.y.a).to.equal(3);
						expect(bar.vars.y.b).to.equal(4);
						expect(bar.vars.y.c[1]).to.equal(6);
					});

					it("should inherit parent values", function () {
						var Baz = Bar.extend({
							vars : {
								x : true
							}
						});

						var baz = new Baz();

						expect(baz.vars.y.a).to.equal(3);
						expect(baz.vars.y.b).to.equal(4);
						expect(baz.vars.y.c[1]).to.equal(6);
					});

					it("should not manipulate parent values", function () {
						bar.vars.y.b = 9;

						expect(foo.vars.y.b).to.equal(2);
						expect(bar.vars.y.b).to.equal(9);
					});

				});

			});

		});

	});
});
