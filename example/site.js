// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* site.js */

define([
	"../red/base/Class",
	"./shell",
	"./home",
	"../red/modules/Module",
	"../red/modules/tracking/GATracking",
	"../red/modules/tracking/OmnitureTracking",
	"../red/modules/ticker/Ticker",
	"../red/modules/social/FacebookSocial",
	"../red/modules/social/TwitterSocial",
	"../red/modules/scroller/Scroller",
	"../red/modules/ios-page-control/PageControl",
	"../red/modules/custom-form-field/CustomFormField",

	// global plugins and libraries that are also needed but dont support amd
	// thus we don't add them as arguments in the function below
	"jquery",
	"$plugins/jquery.pubsub"],
	function (Class, Shell, Home, Module, GA, Omniture, Ticker, Facebook, Twitter, Scroller, PageControl, CustomFormField, $) {

	var Site = Class.extend({

		STATIC_URL : $("link[rel='static-url']").attr("href"),

		models : {},

		init : function () {
			// Wait for DOMContentLoaded
			$(this.proxy(this.onReady));
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

			this.models.home = new Home();
			this.models.shell = new Shell();
			this.models.module = new Module();
			this.models.ga = new GA();
			this.models.omniture = new Omniture();
			this.models.ticker = new Ticker();
			this.models.facebook = new Facebook();
			this.models.twitter = new Twitter();
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
