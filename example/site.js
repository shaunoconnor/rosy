// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* site.js */

define([
	'../red/base/Class',
	'./shell',
	'./home',
	'../red/modules/Module',
	'../red/modules/tracking/GATracking.js',
	'../red/modules/tracking/OmnitureTracking.js',
	'../red/modules/ticker/Ticker.js',
	'../red/modules/social/FacebookSocial.js',
	'../red/modules/social/TwitterSocial.js',
	'../red/modules/scroller/Scroller.js',
	'../red/modules/ios-page-control/PageControl.js',
	'../red/modules/custom-form-field/CustomFormField.js',

	// global plugins and libraries that are also needed but dont support amd
	// thus we don't add them as arguments in the function below
	"../libs/plugins/jquery.pubsub.js",
	"../libs/plugins/jquery.tmpl.js"],
	function (Class, Shell, Home, Module, GA, Omniture, Ticker, Facebook, Twitter, Scroller, PageControl, CustomFormField) {

	var Site = Class.extend({

		MEDIA_URL : $("link[rel='media-url']").attr("href"),

		models : {},

		init : function () {
			// Wait for DOMContentLoaded
			$($.proxy(this.onReady, this));
		},

		createModel : function (page, vars) {
			var master = this.Page,
				Model = (page && typeof master[page] === "function" ? master[page] : master);

			return (this.models[page || "page"] = new Model(vars));
		},

		getModel : function (page) {
			return this.models[page];
		},

		getModels : function () {
			return this.models;
		},

		onReady : function () {
			var body = $("body"),
				// Use `attr("data-page-class")` if < jQuery 1.6
				pageClass = body.data("pageClass");

			// creates `Page()` based on `<div data-page-class="Home">`
			this.setMediaURL();
			this.createModel(pageClass);

			this.models.Facebook = new example.module.social.Facebook();
			this.models.Twitter = new example.module.social.Twitter();

			// Create the site shell
			this.models.Shell = new this.Shell();
		}
	});

	return new Site();
});
