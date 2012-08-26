// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
// Google Analytics Tracking

/**
 * Omniture and GA tracking event wrappers
 * init: new red.module.tracking.GA()
 * publish: this.publish("track", {category:, action:, label:, value: });
 */
define(["../Module"], function (Module) {

	/*global _gaq:true*/
	window._gaq = window._gaq || [];

	return Module.extend({

		vars : {
			debug : true,
			property_id : "", // init({property_id: "XXXXX"}) OR (preferably) <meta property="ga:property_id" content="XXXXX"/>
			domain : ""
		},

		init : function () {
			this.loadJSDK();

			this.subscribe("track", this.proxy(this.track, this));
		},

		log : function () {
			if (this.vars.debug) {
				try {
					console.log(arguments);
				} catch (e) {}
			}
		},

		track : function (e, eData) {
			var el = $(e.currentTarget),
			data = eData || el.data();

			data.type = data.type || "event"; // default to an event tracking type

			this.log("ga track", data.type, data);

			switch (data.type) {
			case 'event':
				_gaq.push(['_trackEvent', data.category, data.action, data.label, data.value]);
				break;
			case 'social':
				this.log("Tracking: GA social (not hooked up yet)::", data);
				//_gaq.push(['_trackSocial', network, socialAction, opt_target, opt_pagePath]);
				break;
			default:
			case 'page':
				_gaq.push(['_trackPageview', data.url || window.location.hash ]);
				break;
			}
		},

		loadJSDK : function () {
			this.vars.property_id = this.vars.property_id || $('meta[property="ga:property_id"]').attr("content");
			this.vars.domain = this.vars.domain || $('meta[property="ga:domain"]').attr("content");

			if (!this.vars.property_id) {
				throw 'tracking:GA missing PROPERTY_ID <meta property="ga:property_id" content="UA-XXXXXX-X"/>';
			}

			if (!this.vars.domain) {
				throw 'tracking:GA missing DOMAIN  <meta property="ga:domain" content="xxxxx.com"/>';
			}

			this.log("ga.tracking:: " + this.vars.property_id);

			_gaq.push(["_setAccount", this.vars.property_id]);
			_gaq.push(['_setDomainName', this.vars.domain]);
			_gaq.push(['_setAllowLinker', true]);
			_gaq.push(["_trackPageview"]);
			_gaq.push(["_trackPageLoadTime"]);

			(function(d,t){
				var g = d.createElement(t),
					s = d.getElementsByTagName(t)[0];
				g.src = ('https:' === location.protocol?'//ssl':'//www') + '.google-analytics.com/ga.js';
				s.parentNode.insertBefore(g, s);
			}(document, 'script'));
		},

		destroy : function () {
			this.vars = null;
			this.sup();
		}

	});
});
