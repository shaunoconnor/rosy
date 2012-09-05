define(

	[
		"red/views/View",
		"$"
	],

	function (View, $) {

		"use strict";

		return View.extend({

			$content : "",

			init : function () {

			},

			load : function () {

				var selector = this.viewGroup.config.selector;

				if (this.viewGroup.currentView !== null) {

					/**
					* Do whatever loading you need to do here.
					* in this case, request the url via ajax, then inject into the DOM.
					*/

					$.ajax(this.data.route).done(this.proxy(function (data) {

						data = $("<div/>").append(data);

						this.$content = $(data).find(selector);
						this.$content.css("opacity", "0");

						$(selector).replaceWith(this.$content);
						this.loadComplete();
					}));
				}

				/**
				* If there is no current view, assume the content already loaded
				* is the content for the current view.
				*/

				else {
					this.$content = $(selector);
					this.loadComplete();
				}
			},

			transitionIn : function () {
				this.$content.animate({opacity : 1}, this.transitionInComplete);
			},

			transitionOut : function () {
				this.$content.animate({opacity : 0}, this.transitionOutComplete);
			},

			destroy : function () {
				this.$content = null;
				this.sup();
			}
		});
	}
);
