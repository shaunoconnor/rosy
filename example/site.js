// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* site.js */
/*jshint onevar:false*/

define(function (require, exports, module) {
	var Class = require("../red/base/Class");

	// each of your views needs to be required so it can be set in Site.createModel
	var views = {
		Page  : require("./base/Page"),
		Home  : require("./home"),
		About : require("./about")
	};

	// only include the modules you need
	var GATracking        = require("../red/modules/tracking/GATracking"),
		OmnitureTracking  = require("../red/modules/tracking/OmnitureTracking"),
		Ticker            = require("../red/modules/ticker/Ticker"),
		FacebookSocial    = require("../red/modules/social/FacebookSocial"),
		TwitterSocial     = require("../red/modules/social/TwitterSocial"),
		Scroller          = require("../red/modules/scroller/Scroller"),
		PageControl       = require("../red/modules/ios-page-control/PageControl"),
		CustomFormField   = require("../red/modules/custom-form-field/CustomFormField"),
		Shell             = require("./shell");

	// global plugins and libraries that are also needed but dont support amd
	// thus we don't add them as arguments in the function below
	require("jquery");
	require("$plugins/jquery.pubsub");

	var Site = Class.extend({

		STATIC_URL : $("link[rel='static-url']").attr("href"),

		models : {},

		init : function () {
			// Wait for DOMContentLoaded
			$(this.proxy(this.onReady));
		},

		createModel : function (page, vars) {
			var Model = views[page] || views.Page;

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
			this.createModel(pageClass);

			this.models.shell = new Shell();
			this.models.ga = new GATracking();
			this.models.omniture = new OmnitureTracking();
			this.models.ticker = new Ticker();
			this.models.facebook = new FacebookSocial();
			this.models.twitter = new TwitterSocial();
			this.models.scroller = new Scroller({
				target : $("<div><div></div></div>")
			});
			this.models.pageControl = new PageControl({
				parent : $("<div>"),
				list : $("<div>"),
				items : $("<div>")
			});
			this.models.customFormField = new CustomFormField({
				field : $("<div>")
			});

			// testing pubsub (as a global module)
			this.subscribe("test", function(){
				console.log("pubsub works!");
			});
			this.publish("test");
		}
	});

	return new Site();
});
