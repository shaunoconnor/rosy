define(

	[
		"../base/Class",
		"../utils/Utils",
		"./View",
		"./ViewGroup",
		"./ViewRouter",
		"./TransitionManager",
		"./ViewNotification",
		"$"
	],

	function (Class, Utils, View, ViewGroup, ViewRouter, TransitionManager, ViewNotification, $) {

		/*jshint eqnull:true*/

		"use strict";

		var HISTORY_SUPPORTED = window.history && window.history.pushState,
			HASH_VALUE,
			PATH_VALUE,
			ERROR_HANDLER = function (e) { throw e; };

		var ViewManager = Class.extend({

			_pollInterval : null,
			_router : null,
			_viewGroups : [],
			_activeElements : {},

			/**
			*	SUPPORTED FALLBACK MODES:
			*
			*	soft	- If the History API is not supported, changes state without url change.
			*	hard	- If the History API is not supported, forces hard reloads on all links.
			*	hash|#	- If the History API is not supported, falls back to hash tags.
			**/

			fallbackMode : "hard",
			aliases : [],
			selectors : ["[data-route]", "a[href^='#']", "a[href^='/']"],
			activeClass : "active",
			disabledClass : "disabled",
			bubble : false,
			container : null,
			initialized : false,

			/**
			*	CONFIG OPTIONS:
			*
			*	viewGroups			:	Array
			*	fallbackMode			:	hard|soft|hash
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

				if (this.initialized) {
					ERROR_HANDLER(new Error("ViewManager has already been initialized."));
				}

				var i,
					l,
					viewGroup,
					viewGroups = config.viewGroups,
					defaultRoute = config.defaultRoute || null;

				config.fallbackMode = config.fallbackMode === "hash" ? "#" : config.fallbackMode;

				TransitionManager	=	config.TransitionManager || TransitionManager;

				this.fallbackMode	=	config.fallbackMode || this.fallbackMode;
				this.aliases		=	config.aliases || this.aliases;
				this.selectors		=	config.selectors || this.selectors;
				this.activeClass	=	config.activeClass || this.activeClass;
				this.bubble			=	config.bubble || this.bubble;
				this.container		=	$(config.container || document);

				if (config.maxWaitTime) {
					View.setMaxWaitTime(config.maxWaitTime);
				}

				if (config.errorHandler) {
					ERROR_HANDLER = config.errorHandler;
					View.setErrorHandler(config.errorHandler);
				}

				for (i = 0, l = viewGroups.length; i < l; i ++) {
					viewGroup = new ViewGroup(viewGroups[i], this);

					viewGroup.config = viewGroup.config || {};
					viewGroup.config.useHistory = viewGroup.config.useHistory === "hash" ? "#" : viewGroup.config.useHistory;
					this._viewGroups.push(viewGroup);

					if (viewGroup.config.useHistory === "#" && this.fallbackMode === "#") {
						ERROR_HANDLER(new Error("You can't use the 'hash' fallback mode in conjunction with useHistory = 'hash'"));
					}
				}

				this._router = new ViewRouter(this._viewGroups);

				if (HISTORY_SUPPORTED) {
					PATH_VALUE = window.location.pathname;
					window.addEventListener('popstate', this._onStateChange);
				}

				else {
					if (this.fallbackMode === "#") {
						HASH_VALUE = window.location.hash;
						this._pollInterval = this.setInterval(this._pollForHashChange, 100);
					}
				}

				this.container.on("click", this.selectors.join(","), this._onLinkClick);

				this._gotoRoute({route : defaultRoute || window.location.pathname});

				if (window.location.hash) {
					this._gotoRoute({route : window.location.hash});
				}

				this.initialized = true;
			},

			changeRoute : function (route/*, data|transition, cb*/) {

				var data = Utils.isObject(arguments[1]) ? arguments[1] : {};
				data.route = route;

				data.transition = typeof arguments[1] === "string" ? arguments[1] : null;
				data.cb = Utils.isFunction(arguments[1]) ? arguments[1] : (arguments[2] || null);

				this._gotoRoute(data);
			},

			updateTitle : function (title) {
				if (HISTORY_SUPPORTED) {
					history.replaceState(null, title, window.location.href + window.location.hash);
				}
				document.title = title;
				this.publish(ViewNotification.TITLE_CHANGED, {title : title});
			},

			closeViewGroup : function (viewGroup, cb) {
				TransitionManager.close((typeof viewGroup === "string") ? this.getViewGroup(viewGroup) : viewGroup, cb);
			},

			getViewGroup : function (id) {

				var i,
					l,
					viewGroup;

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
					j,
					l2,
					k,
					l3,
					m,
					m2,
					$el,
					route,
					elRoute,
					regexes,
					toCheck = [],
					$elements = this.container.find(this.selectors.join(","));

				for (i = 0, l = arguments.length; i < l; i ++) {
					route = arguments[i];
					regexes = this._router.getRouteRegexes(route);

					toCheck.push({route : route, regexes: regexes});
				}

				for (i = 0, l = $elements.length; i < l; i ++) {

					$el = $($elements[i]);

					if ($el.data("active-disabled") == null && !$el.hasClass(this.activeClass)) {

						elRoute = $el.data("route") || $el.attr("href");

						for (j = 0, l2 = toCheck.length; j < l2; j ++) {
							route = toCheck[j].route;
							regexes = toCheck[j].regexes;

							for (k = 0, l3 = regexes.length; k < l3; k ++) {
								m = regexes[k].exec(route);
								m2 = regexes[k].exec(elRoute);

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
				}
			},

			deactivate : function (/*route1, route2, route3, ...*/) {

				var i,
					l,
					j,
					l2,
					route;

				for (i = 0, l = arguments.length; i < l; i ++) {
					route = arguments[i];

					if (this._activeElements[route]) {

						for (j = 0, l2 = this._activeElements[route].length; j < l2; j ++) {
							$(this._activeElements[route][j]).removeClass(this.activeClass);
						}

						this._activeElements[route] = null;
					}
				}
			},

			_onLinkClick : function (e) {

				var $el = $(e.currentTarget),
					data = $el.data();

				if (!$el.attr("target")) {

					if ($el.hasClass(this.disabledClass)) {
						e.preventDefault();
						return false;
					}

					data.route = data.route || $el.attr("href");

					if (data.route) {

						data.event = e;
						this._gotoRoute(data);

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

			_onStateChange : function () {
				if (window.location.pathname !== PATH_VALUE) {
					PATH_VALUE = window.location.pathname;
					this._gotoRoute({route : window.location.pathname, updateHistory : false});
					return;
				}
			},

			_gotoRoute : function (data) {
				var i,
					l,
					cb,
					skipped = 0,
					matchedView,
					matchedViews,
					viewGroup,
					currentView,
					viewData,
					didRoute = false;

				// Force all routes to begin with a "/" and have no hashtag
				data.route = data.route.replace("#", "");
				data.route = ((data.route.substr(0, 1) !== "/") ? "/" : "") + data.route;

				// If this route is an alias, grab the alias value
				data.route = this.aliases[data.route] || data.route;

				if (data.cb) {
					cb = data.cb;
					data.cb = null;
					delete data.cb;
				}

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

								if (currentView.routeRegEx === matchedView.regex) {
									if (currentView.__update(matchedView.params, data) === false) {
										if (cb) {
											cb();
										}
										return false;
									}
								}

								else {

									viewData = Utils.extend({}, data, matchedView);

									viewData.viewGroup = null;
									delete viewData.viewGroup;

									if (!currentView.__canClose(viewData)) {

										if (cb) {
											cb();
										}
										return false;
									}
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

								viewGroup.__updateRoute(data.route);

								// If a route maps to a View, and that View's ViewGroup has useHistory = true
								if (viewGroup.config.useHistory && data.updateHistory !== false) {
									this._updateHistory(data.title || "", data.route, viewGroup.config.useHistory === "#");
								}

								if (!currentView || currentView.routeRegEx !== matchedView.regex) {

									this._changeView(matchedView, data, cb);
									didRoute = true;
								}

								else if (currentView) {
									skipped ++;
								}
							}
						}

						else {
							skipped ++;
						}
					}

					/**
					* Lastly, loop through all view groups and activate all active routes
					**/

					for (i = 0, l = this._viewGroups.length; i < l; i ++) {
						this.activate(this._viewGroups[i].currentRoute);
					}

					if (skipped === l) {
						if (cb) {
							cb();
						}
						return false;
					}

					return didRoute;
				}

				return false;
			},

			_changeView : function (matchedView, data, cb) {

				data = data || {};

				if (matchedView.viewClass) {

					require([matchedView.viewClass], this.proxy(function () {

						TransitionManager.transition(matchedView, data, data.transition, this.proxy(function () {

							this.publish(ViewNotification.VIEW_CHANGED, {view : matchedView, viewGroup : matchedView.viewGroup});

							if (cb) {
								cb();
							}
						}));
					}));
				}
				else {

					TransitionManager.close(matchedView.viewGroup, this.proxy(function () {

						this.publish(ViewNotification.VIEW_CLOSED, {view : matchedView, viewGroup : matchedView.viewGroup});

						if (cb) {
							cb();
						}
					}));
				}
			},

			_updateHistory : function (title, route, useHash) {

				if (HISTORY_SUPPORTED && !useHash) {
					history.pushState(null, title || "", route + window.location.hash);
				}

				else if (useHash || this.fallbackMode === "#") {

					if (!this._pollInterval) {
						HASH_VALUE = HASH_VALUE || window.location.hash;
						this._pollInterval = this.setInterval(this._pollForHashChange, 100);
					}

					window.location.hash = route;
				}
			},

			_regexMatch : function (m, m2) {

				var i,
					l;

				m = m.concat();
				m2 = m2.concat();

				m.splice(0, 1);
				m2.splice(0, 1);

				for (l = m.length, i = l; i >= 0; i --) {
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
