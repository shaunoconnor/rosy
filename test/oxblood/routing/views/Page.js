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
				this.setTimeout(this.loadComplete,0);
			},

			transitionIn : function () {
				State.changeTransitionState("transitionIn");
				this.setTimeout(this.transitionInComplete,0);
				State.changeState(this.config.bodyClass);
			},

			transitionOut : function () {
				State.changeTransitionState("transitionOut");
				this.setTimeout(this.transitionOutComplete,0);
			},

			cleanup : function () {
				State.changeTransitionState("cleanup");
				this.unsubscribe();
				this.setTimeout(this.cleanupComplete,0);
			},

			loadComplete : function () {
				State.changeTransitionState("loadComplete");
				this.sup();
			},

			transitionInComplete : function () {
				State.changeTransitionState("transitionInComplete");
				this.sup();
			},

			transitionOutComplete : function () {
				State.changeTransitionState("transitionOutComplete");
				this.sup();
			},

			cleanupComplete : function () {
				State.changeTransitionState("cleanupComplete");
				this.sup();
			}

		});
	}
);