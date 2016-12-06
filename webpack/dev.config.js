
var webpack = require("webpack");

module.exports = function (options) {

    if(!options) options = {};

    var devConfig = Object.assign({},require("./common.config")(options));// setting common config

    /*************************
     * Extending Output
     **************************/

    devConfig.output.sourceMapFilename = '[name].map';


    /*************************
    * Extending Plugins
    **************************/
    devConfig.plugins.push(new webpack.SourceMapDevToolPlugin({
        filename: null, // if no value is provided the sourcemap is inlined
        test: /\.(tsx?|js)($|\?)/i // process .js and .ts files only
    }));

    return devConfig;
};