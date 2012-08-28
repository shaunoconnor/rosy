define(

	[
		"OxBlood",
		"red/base/Class",
		"red/views/ViewManager",
		"./State",
		"./routes"
	],

	function (OxBlood, Class, ViewManager, State, routes) {

		var REAL_URL = window.location.pathname + window.location.search,
			REAL_HASH = window.location.hash = "",
			HISTORY_SUPPORT = window.history && window.history.pushState;

		return function () {

			describe("History Management", function () {

				describe("useHistory = false", function () {

					before(function (done){
						ViewManager.getViewGroup("main").config.useHistory = false;
						done();
					});

					it("should successfully change view without updating history", function (done) {

						ViewManager.changeRoute("/test", null, function () {
							expect(window.location.pathname + window.location.search).to.equal(REAL_URL);
							expect(State.currentState).to.equal("home");
							done();
						});
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
								expect(State.currentState).to.equal("about");
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

						var route = "/test/contact";

						window.location.hash = route;

						State.onChange = function() {
							expect(State.currentState).to.equal("contact");
							State.onChange = null;

							if (HISTORY_SUPPORT) {
								history.pushState(null, null, REAL_URL);
							}
							done();
						};
					});
				});
			});

		};
	}
);
