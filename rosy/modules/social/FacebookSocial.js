/*global FB*/

/**
 *	Required DOM elements:
	<link rel="media_url" href="XXXXXXX">
	<meta property="fb:app_id" content="XXXXXX">

 *	Optional DOM elements:
	<div id="fb-root"> // added for you if it doesn't exist
	<a data-custom-post="facebook"></a> // fires customFacebookPost

 *	How to Use
		var FB = new FacebookSocial({debug:false}); //
		this.publish(FacebookSocial.LOGIN); // will launch authenticate-dialog (check popup blocker)
		this.subscribe(FacebookSocial.HANDLE_LOGIN, function (e, response) {}));


 *	Refer to http://yoast.com/social-buttons/ for more information on social-tracking-events
 */

define([
	"../Module",
	"$"
	// Tracking stuff? Add it here
	// ("../tracking/GATracking" || "../tracking/OmnitureTracking")
], function (Module, $, Tracking) {

	"use strict";

	var STATIC = {
		POST : "social/facebook/post",
		RENDER : "social/facebook/render",
		LOGIN : "social/facebook/login",
		LOGOUT : "social/facebook/logout",
		GET_STATUS : "social/facebook/get-status",
		GET_ME : "social/facebook/get-me",
		SET_ACTION : "social/facebook/set-action",
		HANDLE_ACTION : "social/facebook/handle-action",
		HANDLE_ME : "social/facebook/handle-me",
		HANDLE_LOGIN : "social/facebook/handle-login",
		HANDLE_LOGOUT : "social/facebook/handle-logout"
	},

	IS_CONNECTED = false,
	APP_ID = $('[property="fb:app_id"]').attr("content"),
	NAMESPACE = $('[property="og:namespace"]').attr("content"),
	STATIC_URL = $('link[rel="static-url"]').attr("href");

	return Module.extend({

		"static" : STATIC,

		vars : {
			debug : true
		},

		init : function () {
			this.loadJSDK();

			$(document).on("click", '[data-custom-social="facebook"]', this.customFacebookPost);
		},

		// this.publish(STATIC.SET_ACTION, {custom_action:"rsvp", type :properties: {event:"http://shum-harden.com/meta?"}})
		setAction : function (n) {
			var options = n.data;

			if (IS_CONNECTED) {

				var action = options.action || (NAMESPACE + ":" + options.custom_action);

				if (action && options.properties) {
					FB.api("/me/" + action, 'post', options.properties, function (response) {
						this.publish(STATIC.HANDLE_ACTION, [response]);
					});
				} else {
					this.log("Facebook: You're doing actions wrong");
				}
			}
		},

		getStatus : function () {
			FB.getLoginStatus(this.proxy(function (response) {
				if (response.session || response.status === "connected") {// user has a session, make sure they are "FULLY REGSITERED"
					IS_CONNECTED = true;
					this.publish(STATIC.HANDLE_LOGIN, [response]);
				} else {
					IS_CONNECTED = false;
					this.publish(STATIC.HANDLE_LOGOUT, [response]);
				}

				this.log(response);
			}));
		},

		getLogout : function () {
			FB.logout(function (response) {
				IS_CONNECTED = false;

				this.publish(STATIC.HANDLE_LOGOUT, [response]);
				this.publish(Tracking.TRACK, [{
					type : "event",
					category: "facebook",
					action : "logout",
					label : "user logged out"
				}]);
			});
		},

		getMe : function () {
			if (IS_CONNECTED) {
				FB.api('/me', function (response) {
					this.publish(STATIC.HANDLE_ME, [response]);
					this.publish(Tracking.TRACK, [{
						type : "event",
						category: "facebook",
						action : "me",
						label : "got user info"
					}]);
				});
			}
		},

		getLogin : function () {
			FB.login(function (response) {
				this.log(response);
				if (response.authResponse) {
					IS_CONNECTED = true;
					this.publish(STATIC.HANDLE_LOGIN, [response]);
					this.publish(Tracking.TRACK, [{
						type : "event",
						category: "facebook",
						action : "login:accepted",
						label : "user connected w/ fb"
					}]);
				} else {
					this.publish(Tracking.TRACK, [{
						type : "event",
						category: "facebook",
						action : "login:canceled",
						label : "user canceled login"
					}]);
				}
			}, {
				scope : "publish_actions"
			}); // CUSTOMIZE THIS FOR YOUR LEVEL OF NEED
		},


		// stubs ment for overwriting when extending this module
		onShare : function () {},

		onAddComment : function () {},

		onSesionChange : function () {},

		onStatusChange : function () {},

		onLogin : function () {
			IS_CONNECTED = true;
		},

		onRender : function () {},

		// parse the URL to run like-specific callbacks
		onLike : function (URL) {
			// tracls as facebook-like-profile or facebook-like-other (for custom page liking)
			var action = "on-like-" + ((URL.indexOf("seed") > 0) ? "profile" : "other");

			this.publish(Tracking.TRACK, [{
				type : "event",
				category : "facebook",
				action : action,
				label : URL
			}]);
		},

		//	add [data-custom-social="facebook"] to a link to automatically fire this
		//	publishobject reads from meta tags in the link and defaults to the og:meta in the <head>
		//
		//	EXAMPLE
		//	<a
		//		data-custom-social-="facebook"						// REQUIred
		//		data-origin="http://example.com"					// optional
		//		data-method="stream.publish"						// optional
		//		data-attachment-name="Some Name"					// optional
		//		data-attachment-caption="Some Caption"				// optional
		//		data-attachment-description="Some Description"		// optional
		//		data-attachment-media-type="image"					// optional
		//		data-attachment-media-src=""						// optional
		//		data-attachment-media-href=""						// optional
		//		data-action-text="Some ActionText"					// optional
		//		data-action-href=""									// optional
		//	>Facebook</a>
		//
		//	Also, you can $.trigger() a "custom-facebook-post" event after a click optionall run customFacebookPost
		//
		//	Example
		//	$("body").trigger("custom-facebook-post", {origin:"http://example.com", attachmentName : "Some Name"})
		//
		customFacebookPost : function (e, eData) {

			var el = $(e.currentTarget),
				data = eData || el.data(),
				publishObj = this.getPublishObj(data);

			FB.ui(publishObj);

			this.publish(Tracking.TRACK, [{
				type : "event",
				category : "facebook",
				action : "on-post",
				label : data.origin
			}]);

			return data;
		},

		getPublishObj : function (data) {
			return ({
				method : data.method || "stream.publish",
				origin : data.origin || $('meta[property="og:url"]').attr("content"),
				attachment : {
					name : data.attachmentName || $('meta[property="og:title"]').attr("content"),
					caption : data.attachmentCaption || $('meta[property="og:description"]').attr("content"),
					description : data.attachmentDescription || "",
					media : [{
						type : data.attachmentMediaType || "image",
						src : data.attachmentMediaSrc || $('meta[property="og:image"]').attr("content"),
						href : data.attachmentMediaHref || $('meta[property="og:url"]').attr("content")
					}]
				},
				action_links : [{
					text : data.attachmentActionText || "Click Here",
					href : data.attachmentActionHref || $('meta[property="og:url"]').attr("content")
				}]
			});
		},

		onFBInit : function () {
			FB.Event.unsubscribe("xfbml.render", this.onFBInit); // unregister, we only want to init once

			this.subscribe(STATIC.POST,  this.customFacebookPost);
			this.subscribe(STATIC.RENDER, this.render);
			this.subscribe(STATIC.LOGIN, this.getLogin);
			this.subscribe(STATIC.LOGOUT, this.getLogout);
			this.subscribe(STATIC.GET_STATUS, this.getStatus);
			this.subscribe(STATIC.GET_ME, this.getMe);
			this.subscribe(STATIC.SET_ACTION, this.setAction);

			this.getStatus();
		},

		fbAsyncInit : function () {

			FB.Event.subscribe("comments.add", this.onAddComment);
			FB.Event.subscribe("auth.sessionChange", this.onSesionChange);
			FB.Event.subscribe("auth.statusChange", this.onStatusChange);
			FB.Event.subscribe("auth.login", this.onLogin);
			FB.Event.subscribe("edge.create", this.onLike);
			FB.Event.subscribe("xfbml.render", this.onRender);
			FB.Event.subscribe("xfbml.render", this.onFBInit);

			FB.init({
				appId      : APP_ID, // App ID
				channelUrl : STATIC_URL + "/js/rosy/modules/social/facebook-channel.html", // Channel File
				status     : true, // check login status
				cookie     : true, // enable cookies to allow the server to access the session
				oauth      : true, // enable OAuth 2.0
				xfbml      : true  // parse XFBML
			});
		},

		render : function () {
			FB.XFBML.parse();
		},

		log : function () {
			if (this.vars.debug) {
				try {
					console.log(arguments);
				} catch (e) {}
			}
		},

		loadJSDK : function () {
			STATIC_URL = $('link[rel="static-url"]').attr("href");

			if (!$("#fb-root").length) {
				$("body").append($('<div id="fb-root">'));
			}

			if (!STATIC_URL) {
				throw 'rosy/modules/social/Facebook.js requires <link rel="static-url" href="/" />';
			}

			if (!APP_ID) {
				// Create FB developer account, create a new app, set the URL of the app to http://localhost:8000 for testing
				throw 'rosy/modules/social/Facebook.js requires <meta property="fb:app_id" content="none" />';
			}

			window.fbAsyncInit = this.fbAsyncInit;

			$.ajax({
				dataType: "script",
				url: "//connect.facebook.net/en_US/all.js",
				cache: true
			}).done(this.onReady);
		},

		destroy : function () {
			$(document).off("click", '[data-custom-social="facebook"]', this.customFacebookPost);

			this.sup();
		}
	});

});