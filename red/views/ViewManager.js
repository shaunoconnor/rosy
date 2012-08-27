define(

	[
		"../base/Class",
		"./ViewGroup",
		"./ViewRouter",
		"./TransitionManager",
		"./ViewNotification",
		"$",
	],

	function (Class, ViewGroup, ViewRouter, TransitionManager, ViewNotification, $) {

		/*jshint eqnull:true*/

		"use strict";

		var HISTORY_SUPPORTED = window.history && window.history.pushState;
		var HASH_VALUE;

		var ViewManager = Class.extend({

			_pollInterval : null,
			_router : null,
			_viewGroups : [],
			_activeElements : {},

			/**
			*	SUPPORTED MODES:
			*
			*	soft	- If the History API is not supported, changes state without url change.
			*	hard	- If the History API is not supported, forces hard reloads on all links.
			*	hash|#	- If the History API is not supported, falls back to hash tags.
			**/

			mode : "hard",
			aliases : [],
			selectors : ["[data-route]", "a[href^='#']", "a[href^='/']"],
			activeClass : "active",
			disabledClass : "disabled",
			bubble : false,
			container : null,

			/**
			*	CONFIG OPTIONS:
			*
			*	viewGroups			:	Array
			*	mode				:	hard|soft|hash
			*	aliases				:	Array
			*	selectors			:	Array
			*	bubble				:	true|false
			*	container			:	String|DOMElement
			*	defaultRoute		:	String
			*	activeClass			:	String
			*	disabledClass		:	String
			*	TransitionManager	:	Class
			**/

			initialize : function (config) {

				config.mode = config.mode === "hash" ? "#" : config.mode;

				this.subscribe(ViewNotification.ROUTE_CHANGE, this._handleRouteChange);
				this.subscribe(ViewNotification.UPDATE_TITLE, this._updateTitle);
				this.subscribe(ViewNotification.CLOSE_VIEW_GROUP, this._closeViewGroup);

				TransitionManager	=	config.TransitionManager || TransitionManager;

				this.mode			=	config.mode || this.mode;
				this.aliases		=	config.aliases || this.aliases;
				this.selectors		=	config.selectors || this.selectors;
				this.activeClass	=	config.activeClass || this.activeClass;
				this.bubble			=	config.bubble || this.bubble;
				this.container		=	$(config.container || document);

				var i,
					l,
					viewGroup,
					viewGroups = config.viewGroups,
					defaultRoute = config.defaultRoute || null;

				for (i = 0, l = viewGroups.length; i < l; i ++) {
					viewGroup = new ViewGroup(viewGroups[i], this);

					viewGroup.config = viewGroup.config || {};
					viewGroup.config.useHistory = viewGroup.config.useHistory === "hash" ? "#" : viewGroup.config.useHistory;
					this._viewGroups.push(viewGroup);

					if (viewGroup.config.useHistory === "#" && this.mode === "#") {
						throw new Error("You can't use the 'hash' fallback mode in conjunction with useHistory = 'hash'");
					}
				}

				this._router = new ViewRouter(this._viewGroups);

				if (HISTORY_SUPPORTED) {
					window.addEventListener('popstate', this.proxy(this._onStateChange));
				}

				else {
					if (this.mode === "#") {
						HASH_VALUE = window.location.hash;
						this._pollInterval = this.setInterval(this._pollForHashChange, 100);
					}
				}

				this.container.on("click", this.selectors.join(","), this.proxy(this._onLinkClick));

				if (defaultRoute) {
					this._gotoRoute({route : defaultRoute});
				}

				this._onStateChange(null, true);
			},

			getViewGroup : function (id) {

				var i, l, viewGroup;

				for (i = 0, l = this._viewGroups.length; i < l; i ++) {
					viewGroup = this._viewGroups[i];
					if (viewGroup.id === id) {
						return viewGroup;
					}
				}
				return false;
			},

			activate : function (/*route1, route2, route3, ...*/) {

				var i,
					l,
					route,
					regexes,
					toCheck = [],
					$el,
					$elements = this.container.find(this.selectors.join(","));

				for (i = 0, l = arguments.length; i < l; i ++) {
					route = arguments[i];
					regexes = this._router.getRouteRegexes(route);

					toCheck.push({route : route, regexes: regexes});
				}

				$elements.each(this.proxy(function (k, el) {

					$el = $(el);

					if ($el.data("active-disabled") == null && !$el.hasClass(this.activeClass)) {

						var j,
							l2,
							m,
							m2,
							elRoute = $el.data("route") || $el.attr("href");

						for (i = 0, l = toCheck.length; i < l; i ++) {
							route = toCheck[i].route;
							regexes = toCheck[i].regexes;

							for (j = 0, l2 = regexes.length; j < l2; j++) {
								m = regexes[i].exec(route);
								m2 = regexes[i].exec(elRoute);

								if (m2) {
									if (this._regexMatch(m, m2)) {
										$el.addClass(this.activeClass);
										this._activeElements[route] = this._activeElements[route] || [];
										this._activeElements[route].push($el);
									}
								}
							}
						}
					}
				}));
			},

			deactivate : function (/*route1, route2, route3, ...*/) {
				var i,
					l,
					activeClass = this.activeClass,
					route;


				function removeClass (j, $el) {
					$el.removeClass(activeClass);
				}

				for (i = 0, l = arguments.length; i < l; i ++) {
					route = arguments[i];

					if (this._activeElements[route]) {
						$(this._activeElements[route]).each(removeClass);
						this._activeElements[route] = null;
					}
				}
			},

			_onLinkClick : function (e) {

				var $el = $(e.currentTarget);
				var route;

				var transition = $el.data("transition") || null;
				var viewGroup = $el.data("view-group") || null;

				if (!$el.attr("target") && !$el.hasClass(this.disabledClass)) {

					route = $el.data("route") || $el.attr("href");

					if (route) {
						this._gotoRoute({route : route, transition: transition, viewGroup: viewGroup, event: e});

						if (!this.bubble) {
							return false;
						}
					}
				}
			},

			_pollForHashChange : function () {
				if (window.location.hash !== HASH_VALUE) {
					HASH_VALUE = window.location.hash;
					this._gotoRoute({route : HASH_VALUE}, null, true);
				}
			},

			_onStateChange : function (e) {
				var route = window.location.hash || window.location.pathname;
				this._gotoRoute({route : route, updateHistory : false});
			},

			_handleRouteChange : function (n) {
				this._gotoRoute(n.data);
			},

			_gotoRoute : function (data) {

				// Force all routes to begin with a "/" and have no hashtag
				data.route = data.route.replace("#", "");
				data.route = ((data.route.substr(0,1) !== "/") ? "/" : "") + data.route;

				// If this route is an alias, grab the alias value
				data.route = this.aliases[data.route] || data.route;

				var i,
					l,
					p,
					didRoute = false,
					matchedView,
					viewGroup,
					currentView,
					deactiveRoutes = [],
					activateRoutes = [],
					matchedViews = this._router.getViewsByRoute(data.route);

				if (matchedViews) {

					if (data.event) {
						data.event.preventDefault();
					}

					/**
					* First we loop through all matched view groups to make sure
					* we can actually change to the route in question.
					**/

					for (i = 0, l = matchedViews.length; i < l; i ++) {

						matchedView = matchedViews[i];
						viewGroup = matchedView.viewGroup;
						currentView = matchedView.viewGroup.currentView;

						if (matchedView.viewGroup.currentRoute !== data.route) {

							if (currentView) {

								if (currentView.viewClass === matchedView.viewClass) {
									if (currentView.__update(matchedView.params, data) === false) {
										return false;
									}
								}

								else if (!currentView.canClose()) {
									return false;
								}
							}
						}
					}

					/**
					* If we made it here, we know we can change the route.
					* Loop through all matches and update route accordingly.
					**/

					for (i = 0; i < l; i ++) {

						matchedView = matchedViews[i];
						viewGroup = matchedView.viewGroup;
						currentView = matchedView.viewGroup.currentView;

						if (viewGroup.currentRoute !== data.route) {

							this.deactivate(viewGroup.currentRoute);
							
							if ((!data.viewGroup || viewGroup.id === data.viewGroup)) {

								viewGroup.changeRoute(data.route);

								if (!currentView || currentView.viewClass !== matchedView.viewClass) {

									// If a route maps to a View, and that View's ViewGroup has useHistory = true
									if (viewGroup.config.useHistory && data.updateHistory !== false) {
										this._updateHistory(data.title || "", data.route, viewGroup.config.useHistory === "#");
									}

									this._changeView(matchedView, data);
									didRoute = true;
								}
							}
						}
					}

					/**
					* Lastly, loop through all view groups and activate all active routes
					**/

					for (i = 0, l = this._viewGroups.length; i < l; i ++) {
						this.activate(this._viewGroups[i].currentRoute);
					}

					return didRoute;
				}

				return false;
			},

			_changeView : function (matchedView, data) {
				if (matchedView.viewClass) {
					require([matchedView.viewClass], this.proxy(function (ViewClass) {
						TransitionManager.transition(matchedView, data, (data ? data.transition : null));
					}));
				}
				else {
					TransitionManager.close(matchedView.viewGroup);
				}
			},

			_closeViewGroup : function (n) {

				var d = n.data;

				if (typeof d.viewGroup === "string") {
					d.viewGroup = this.getViewGroup(d.viewGroup);
				}

				TransitionManager.close(d.viewGroup, n.respond);
			},

			_updateHistory : function (title, route, useHash) {
				
				if (HISTORY_SUPPORTED && !useHash) {
					history.pushState(null, title || "", route + window.location.hash);
				}

				else if (useHash || this.mode === "#") {

					window.location.hash = route;

					if (!this._pollInterval) {
						this._pollInterval = this.setInterval(this._pollForHashChange, 100);
					}
				}
			},

			_updateTitle : function (n) {

				if (HISTORY_SUPPORTED) {
					var route = window.location.href;
					history.replaceState(null, n.data.title || "", route);
				}

				document.title = n.data.title || "";
			},

			_regexMatch : function (m, m2) {

				m = m.concat();
				m2 = m2.concat();

				m.splice(0,1);
				m2.splice(0,1);

				for (var l = m.length, i = l; i >= 0; i --) {
					if (m[i] !== m2[i] && typeof m2[i] !== "undefined") {
						return false;
					}
				}

				return true;
			}
		});

		return new ViewManager();
	}
);