define(

	[
		"./Page",
		"$"
	],

	function (Page, $) {

		"use strict";

		return Page.extend({

			load : function () {
				this.sup();
			},

			transitionIn : function () {
				this.sup();
			},

			transitionOut : function () {
				this.sup();
			},

			update : function (params, data) {

				// "who" and "why" are the only valid subsections.
				if (params.subSection !== "who" && params.subSection !== "why") {
					return false;
				}

				if (this.$currentSection) {
					this.$currentSection.hide(300);
				}

				this.$currentSection = this.content.find("." + params.subSection);
				this.$currentSection.show(300);
			},

			destroy : function () {
				this.sup();
			}
		});
	}
);
