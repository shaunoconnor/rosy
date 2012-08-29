define(

	[
		"OxBlood",
		"red/base/Class",
		"red/views/ViewManager",
		"red/views/ViewNotification",
		"./routes"
	],

	function (OxBlood, Class, ViewManager, ViewNotification, routes) {

		var REAL_URL = window.location.pathname + window.location.search,
			REAL_HASH = window.location.hash = "",
			HISTORY_SUPPORT = window.history && window.history.pushState;

		return function () {

			describe("History Management", function () {

				describe("useHistory = false", function () {

					before(function (done){
						ViewManager.getViewGroup("main").config.useHistory = false;
						ViewManager.changeRoute("/test", null, function () {
							done();
						});
					});

					it("should successfully change view without updating history", function (done) {
						expect(window.location.pathname + window.location.search).to.equal(REAL_URL);
						done();
					});

				});

				if (HISTORY_SUPPORT) {

					describe("useHistory = true", function () {

						before(function(done){
							ViewManager.getViewGroup("main").config.useHistory = true;
							done();
						});

						it("should successfully push state", function (done) {

							var route = "/test/about";

							ViewManager.changeRoute(route, null, function () {
								expect(window.location.pathname).to.equal(route);
								done();
							});
						});

						it("should successfully listen for pop state", function (done) {

							var route = "/test/about";

							ViewManager.changeRoute("/test/contact");

							var onPopState = function() {
								expect(window.location.pathname).to.equal(route);
								window.removeEventListener('popstate', onPopState);
								history.pushState(null, null, REAL_URL);
								done();
							};

							window.addEventListener('popstate', onPopState);

							history.go(-1);
						});
					});
				}

				describe("useHistory = '#'", function () {

					before(function(done){
						ViewManager.getViewGroup("main").config.useHistory = "#";
						done();
					});

					it("should successfully push hash changes", function (done) {

						var route = "/test";

						ViewManager.changeRoute(route, null, function () {
							expect(window.location.hash).to.equal('#' + route);
							done();
						});
					});

					it("should successfully listen for hash changes", function (done) {

						var route = "/test/about";

						var subscriber = new Class();
						subscriber.subscribe(ViewNotification.VIEW_CHANGED, function (n) {

							expect(ViewManager.getViewGroup("main").currentView.config.bodyClass).to.equal("about");

							if (HISTORY_SUPPORT) {
								history.pushState(null, null, REAL_URL);
							}

							subscriber.unsubscribe(ViewNotification.VIEW_CHANGED);

							done();
						});

						window.location.hash = route;
					});
				});
			});

		};
	}
);
