define(

	[
		"red/views/View",
		"../State"
	],

	function (View, State) {

		"use strict";

		return View.extend({
		
			init : function () {

			},

			load : function () {
				State.changeTransitionState("load");
				this.loadComplete();
			},

			transitionIn : function () {
				State.changeState(this.config.bodyClass);				
				State.changeTransitionState("transitionIn");
				this.transitionInComplete();
			},

			transitionOut : function () {
				State.changeTransitionState("transitionOut");
				this.transitionOutComplete();
			},

			cleanup : function () {
				State.changeTransitionState("cleanup");
				this.unsubscribe();
				this.cleanupComplete();
			}
		});
	}
);