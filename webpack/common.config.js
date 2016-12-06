
var webpack = require("webpack");
var projectConfig = require("../project.config");
var pkg = require("../package.json");
var util = require("../scripts/util");

module.exports = function (options) {

    /*************************
     * Common Entry
     **************************/

    var entry = projectConfig.bundleMainFile;


    /*************************
     * Common Plugins
     **************************/

    var plugins = [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ];

    /*************************
     * Common rules
     **************************/

    var typescriptLoader = {test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        query: {
            tsconfig: projectConfig.rootDir+"/tsconfig.json"
        }
    };

    if(options.env == "test" && !options.isLocalTesting) //adding inline source map only for test node environment
    {
        typescriptLoader.query.sourceMap = false;
        typescriptLoader.query.inlineSourceMap = true;
    }

    var rules = [typescriptLoader];

    return {
        entry:entry,
        output:{
            path:projectConfig.standAloneDir,
            filename: pkg.name + ".js",
            library:util.camelCase(pkg.name),
            libraryTarget:"umd"
        },
        resolve: {
            extensions: [ '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
            modules: [
                "src",
                "node_modules"
            ]
        },
        module: {
            rules: rules
        },
        plugins: plugins,
        node:  {
            global: true,
            crypto: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false
        }
    }
};