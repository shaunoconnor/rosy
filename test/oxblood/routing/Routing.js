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

		OxBlood.addCoreTests(function () {

			describe("View Routing", function () {

				describe("ViewManager Initialization", function () {

					it("should initialize successfully", function (done) {
						try {
							ViewManager.initialize({
								// mode					:	hard|soft|hash,
								// selectors			:	Array,
								// bubble				:	true|false,
								// container			:	String|DOMElement,
								// defaultRoute			:	String,
								// activeClass			:	String,
								// disabledClass		:	String,
								// TransitionManager	:	Class,
								mode : "soft",
								aliases : routes.aliases,
								viewGroups : routes.viewGroups
							});
							done();
						}
						catch (e) {throw e;}
					});
				});

				describe("History Management", function () {

					describe("useHistory = false", function () {

						before(function(done){
							ViewManager.getViewGroup("main").config.useHistory = false;
							done();
						});

						it("should successfully change view without updating history", function (done) {

							var route = "/test";

							ViewManager.changeRoute(route);

							State.onChange = function() {
								expect(window.location.pathname + window.location.search).to.equal(REAL_URL);
								expect(State.currentState).to.equal("home");
								State.onChange = null;
								done();
							};
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

								ViewManager.changeRoute(route);

								expect(window.location.pathname).to.equal(route);

								State.onChange = function() {
									expect(State.currentState).to.equal("about");
									State.onChange = null;
									done();
								};
							});

							it("should successfully listen for pop state", function (done) {

								var route = "/test/about";

								ViewManager.changeRoute("/test/contact");

								var onPopState = function(){
									expect(window.location.pathname).to.equal(route);
									expect(State.currentState).to.equal("about");

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

							State.onChange = function() {
								expect(window.location.hash).to.equal('#' + route);
								expect(State.currentState).to.equal("home");
								State.onChange = null;
								done();
							};
							ViewManager.changeRoute(route);
						});

						it("should successfully listen for hash changes", function (done) {

							var route = "/test/contact";

							State.onChange = function() {
								expect(window.location.hash).to.equal('#' + route);
								expect(State.currentState).to.equal("contact");
								State.onChange = null;

								if (HISTORY_SUPPORT) {
									history.pushState(null, null, REAL_URL);
								}

								done();
							};

							window.location.hash = route;
						});
					});
				});

				describe("Transitions", function () {

					before(function(done){
						ViewManager.getViewGroup("main").config.useHistory = false;
						done();
					});

					it("sync : transitionOut, cleanup, load, transitionIn", function (done) {

						var states = [];

						State.onTransitionChange = function () {
							states.push(State.transitionState);
							if (states.length >= 4) {
								expect(states[0]).to.equal("transitionOut");
								expect(states[1]).to.equal("cleanup");
								expect(states[2]).to.equal("load");
								expect(states[3]).to.equal("transitionIn");
								done();
							}
						};

						ViewManager.changeRoute("/test", "sync");
					});

					it("async : load, transitionIn, transitionOut, cleanup", function (done) {

						var states = [];

						State.onTransitionChange = function () {
							states.push(State.transitionState);
							if (states.length >= 4) {
								expect(states[0]).to.equal("load");
								expect(states[1]).to.equal("transitionIn");
								expect(states[2]).to.equal("transitionOut");
								expect(states[3]).to.equal("cleanup");
								done();
							}
						};

						ViewManager.changeRoute("/test/contact", "async");
					});

					it("preload : load, transitionOut, transitionIn, cleanup", function (done) {

						var states = [];

						State.onTransitionChange = function () {
							states.push(State.transitionState);
							if (states.length >= 4) {
								expect(states[0]).to.equal("load");
								expect(states[1]).to.equal("transitionOut");
								expect(states[2]).to.equal("transitionIn");
								expect(states[3]).to.equal("cleanup");
								done();
							}
						};

						ViewManager.changeRoute("/test", "preload");
					});

					it("reverse : load, transitionIn, transitionOut, cleanup", function (done) {

						var states = [];

						State.onTransitionChange = function () {
							states.push(State.transitionState);
							if (states.length >= 4) {
								expect(states[0]).to.equal("load");
								expect(states[1]).to.equal("transitionIn");
								expect(states[2]).to.equal("transitionOut");
								expect(states[3]).to.equal("cleanup");
								done();
							}
						};

						ViewManager.changeRoute("/test/contact", "reverse");
					});

				});
			});
		});
	}
);
