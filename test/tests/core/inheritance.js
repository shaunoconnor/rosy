define([
	"oxblood",
	"project/base/Page"
], function (OxBlood, Page) {
	OxBlood.addCoreTests(function () {

		describe("Rosy Inheritance", function () {

			describe("Class Inheritance", function () {

				it("should create an instance of Page", function () {
					expect(new Page()).to.be.an["instanceof"](Page);
				});

				it("should contain vars.x with a value of 1", function () {
					var Foo = Page.extend({
						vars : {
							x : 1
						}
					});

					expect(new Foo().vars.x).to.equal(1);
				});

				it("should contain scoped vars.x values", function () {
					var Foo = Page.extend({
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

			});

		});

	});
});
