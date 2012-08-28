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
								// defaultRoute : "/test",
								mode : "soft",
								aliases : routes.aliases,
								viewGroups : routes.viewGroups
							});
							done();
						}
						catch (e) {throw e;}
					});
				});

				History();
				Transitions();

			});
		});
	}
);
