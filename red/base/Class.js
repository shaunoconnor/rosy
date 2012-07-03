// ### Part of the [Rosy Framework](http://github.com/ff0000/rosy)
/* site.js */

// ## The red Namespace
define(["../../libs/Class",
		// we need pubsub included but we don't need a reference to it with AMD.
		"jquery",
		"$plugins/jquery.pubsub"], function (Class, $) {

	// Extends red.Module
	return Class.extend({

		namespace : null,

		vars : {
			subs : {}
		},

		init : function (vars, context) {},

		getUniqueId : function () {
			var name = this.namespace || "";
			return [name, Math.floor(Math.random() * 9999999)].join("/");
		},

		scopeNotification : function (name) {
			this.uid = this.uid || this.getUniqueId();
			return name + "." + this.uid;
		},

		publish : function (name, args) {
			return $.publish(name, args);
		},

		subscribe : function (name, func) {
			name = this.scopeNotification(name);

			this.vars.subs[name] = this.vars.subs[name] || [];
			this.vars.subs[name].push(func);

			return $.subscribe(name, func);
		},

		unsubscribe : function (name, func) {
			var group, key, i, j;

			if (!name && !func) {
				for (key in this.vars.subs) {
					if (this.vars.subs.hasOwnProperty(key)) {
						for (i = 0, j = this.vars.subs[key].length; i < j; i++) {
							$.unsubscribe(key, this.vars.subs[key][i]);
						}
						this.vars.subs[key] = null;
					}
				}

				delete this.vars.subs;
			} else if (name) {
				name = this.scopeNotification(name);
				group = this.vars.subs[name];

				if (group) {
					for (i = 0, j = group.length; i < j; i++) {
						if (!func || group[i] === func) {
							group[i] = null;
						}
					}
				}

				return $.unsubscribe(name, func);
			}
		},

		// Middleware preventDefault method. A shortcut to avoid delegation for a simple task.
		preventDefault : function (e) {
			e.preventDefault();
		},

		proxy : function (func) {
			return $.proxy(func, this);
		},

		// Middleware setTimeout method. Allows for scope retention inside timers.
		setTimeout : function (func, delay) {
			return window.setTimeout(this.proxy(func), delay);
		},

		destroy : function () {
			this.unsubscribe();
		}
	});
});
