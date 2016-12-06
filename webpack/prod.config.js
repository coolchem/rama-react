
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');
var projectConfig = require("../project.config");
var pkg = require("../package.json");

module.exports = function (options) {

    var prodConfig = Object.assign({},require("./common.config")(options));


    /*************************
     * Extending Output
     **************************/
    if(options.minify)
    {
        prodConfig.output.filename = pkg.name + ".min.js";
    }

    /*************************
     * Extending Plugins
     **************************/

    if(options.minify)
    {
        prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        }))
    }
    else
    {
        prodConfig.plugins.push(new CopyWebpackPlugin([
            {
                context:projectConfig.distDirTemp+"/"+projectConfig.srcDirName,
                from: projectConfig.distDirTemp+"/"+projectConfig.srcDirName,
                to: projectConfig.distDir
            }

        ],{
            debug: true
        }));
    }


    return prodConfig;
};