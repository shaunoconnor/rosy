define(

	var prefix = "libs/plugins/jquery/jquery.";

	function () {

		return {

			load: function (name, req, load, config) {

				req(['$'], function ($) {

					if (!config.isBuild) {
						req([prefix + name], function (val) {
							load(val);
						});
					}
					else {
						load("");
					}
				});
			},

			loadFromFileSystem : function (plugin, name) {
				var fs = nodeRequire('fs');
				var file = require.toUrl(prefix + name) + ".js";
				var text = fs.readFileSync(file).toString();

				text = "define('" + plugin + "!" + name  +
				"', ['$'], function () {\n" + text + "\nreturn jQuery;\n});\n";

				return text;
			},

			write: function (pluginName, moduleName, write, config) {
				write(this.loadFromFileSystem(pluginName, moduleName));
			}
		};
	}
);
