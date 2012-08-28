define(

	[
		"OxBlood",
		"red/base/Class",
		"red/views/ViewManager",
		"./State",
		"./routes"
	],

	function (OxBlood, Class, ViewManager, State, routes) {

		var transitions = {

			sync : [
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete",
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete"
			],
			
			async : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionOut",
				"transitionInComplete",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			],

			preload : [
				"load",
				"loadComplete",
				"transitionOut",
				"transitionOutComplete",
				"transitionIn",
				"transitionInComplete",
				"cleanup",
				"cleanupComplete"
			],

			reverse : [
				"load",
				"loadComplete",
				"transitionIn",
				"transitionInComplete",
				"transitionOut",
				"transitionOutComplete",
				"cleanup",
				"cleanupComplete"
			]
		};

		var positions = ["first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eigth"];


		return function () {

			function testTransition (name) {

				var i,
					states = [],
					transition = transitions[name];

				function testTransitionStep (i) {
					it("should call " + transition[i] + " " + positions[i], function (done) {
						expect(states[i]).to.equal(transition[i]);
						done();
					});
				}

				describe(name, function() {

					before(function(done) {

						State.onTransitionChange = function () {
							states.push(State.transitionState);
						};

						ViewManager.changeRoute("/transition/" + name,  name, function () {
							State.onTransitionChange = null;
							done();
						});
					});

					for (i = 0; i < transition.length; i ++) {
						testTransitionStep(i);
					}
				});
			}

			describe("Transitions", function () {

				before(function(done){

					if (!ViewManager.initialized) {

						ViewManager.initialize({
							mode : "soft",
							aliases : routes.aliases,
							viewGroups : routes.viewGroups
						});	
					}
					
					ViewManager.getViewGroup("main").config.useHistory = false;
					ViewManager.changeRoute("/test", "sync", done);

				});


				for (var transition in transitions) {
					testTransition(transition);
				}
			});
		};
	}
);
