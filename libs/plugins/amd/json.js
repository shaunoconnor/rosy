define(

    [
        "text"
    ],

    function (text) {

        var parseJSON = JSON && JSON.parse ? JSON.parse : function (val) {
            return eval('('+ val +')'); //quick and dirty
        };

        return {

             load: function (name, req, load, config) {

                if (!config.isBuild) {
                    req(["text!" + name], function (val) {
                        load(parseJSON(val));
                    });
                }

                else {
                    load("");
                }
             },

            loadFromFileSystem : function (plugin, name) {

                var fs = nodeRequire('fs');
                var file = require.toUrl(name);
                var text = fs.readFileSync(file).toString();

                text = "define('" + plugin + "!" + name  +
                "', function () {\nreturn " + text + ";\n});\n";

                return text;
            },

            write: function (pluginName, moduleName, write, config) {
                write(this.loadFromFileSystem(pluginName, moduleName));
            }

        }
    }
);