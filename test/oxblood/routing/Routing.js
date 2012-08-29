define(

	[
		"OxBlood",
		"red/base/Class",
		"red/views/ViewManager",
		"./History",
		"./Transitions",
		"./routes"
	],

	function (OxBlood, Class, ViewManager, History, Transitions, routes) {

		var REAL_URL = window.location.pathname + window.location.search,
			REAL_HASH = window.location.hash = "",
			HISTORY_SUPPORT = window.history && window.history.pushState;


		OxBlood.addRoutingTests(function () {

			describe("View Routing", function () {

				before(function (done) {
					ViewManager.initialize({
						// mode					:	hard|soft|hash,
						// selectors			:	Array,
						// bubble				:	true|false,
						// container			:	String|DOMElement,
						// defaultRoute			:	String,
						// activeClass			:	String,
						// disabledClass		:	String,
						// TransitionManager	:	Class,
						// defaultRoute : "/test",
						mode : "soft",
						aliases : routes.aliases,
						viewGroups : routes.viewGroups
					});
					done();
				});

				it("should initialize successfully", function (done) {
					expect(ViewManager.initialized).to.equal(true);
					done();
				});

				it("should be able to change routes programatically", function (done) {
					ViewManager.changeRoute("/test/about", "sync", function () {
						expect(ViewManager.getViewGroup("main").currentView.config.bodyClass).to.equal("about");
						done();
					});
				});

				it("should be able to close view groups programatically", function (done) {
					ViewManager.closeViewGroup("main", function () {
						expect(ViewManager.getViewGroup("main").currentView).to.equal(null);
						done();
					});
				});

				it("should be able to change routes after closing a view group", function (done) {
					ViewManager.changeRoute("/test", "sync", function () {
						expect(ViewManager.getViewGroup("main").currentView.config.bodyClass).to.equal("home");
						done();
					});
				});

				it("should be able to close view groups with a null viewClass", function (done) {
					ViewManager.changeRoute("/nothing", "sync", function () {
						expect(ViewManager.getViewGroup("main").currentView).to.equal(null);
						done();
					});
				});

				it("should be able to cancel route changes with canClose()", function (done) {

					ViewManager.changeRoute("/canClose", "sync", function () {

						var view = ViewManager.getViewGroup("main").currentView;

						view.locked = true;

						ViewManager.changeRoute("/test/about", "sync", function () {
							expect(ViewManager.getViewGroup("main").currentView).to.equal(view);
							view.locked = false;
							ViewManager.changeRoute("/test/about", "sync", function () {
								expect(ViewManager.getViewGroup("main").currentView).to.not.equal(view);
								done();
							});
						});
					});
				});

				it("should be able to cancel route changes with update", function (done) {

					ViewManager.changeRoute("/update/1", "sync", function () {

						var route = ViewManager.getViewGroup("main").currentRoute;

						ViewManager.changeRoute("/update/100", "sync", function () {
							expect(ViewManager.getViewGroup("main").currentRoute).to.equal(route);
							ViewManager.changeRoute("/update/2", "sync", function () {
								expect(ViewManager.getViewGroup("main").currentRoute).to.not.equal(route);
								done();
							});
						});
					});
				});

				History();
				Transitions();

			});
		});
	}
);
