

var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var cpy = require("cpy");
var path = require("path");
var fs = require("fs-extra");
var webpack = require("webpack");


if(argv._ && argv._.length > 0) //look release build
{
    var subCommand = argv._[0];
    if(subCommand.toLowerCase() === "release")
    {
        build(true);
    }

}
else //do dev build
{
    build();
}


function createStandAlone(cb){

    json = JSON.parse(fs.readFileSync(path.resolve("./package.json"), 'utf8'));
    var moduleName = json.name;

    var webPackConfig = {
        context: path.resolve("./"),
        entry: json.main,
        output: {
            path: path.resolve("./") + "/standalone",
            filename: moduleName + ".js",
            library:util.camelCase(moduleName)
        }
    };

    webpack(webPackConfig, function(err, stats) {

        if(err)
            cb(err);
        else
        {
            webPackConfig.output.filename = moduleName +".min.js";
            webPackConfig.plugins = [new webpack.optimize.UglifyJsPlugin({
                compress: { warnings: false }
            })];

            webpack(webPackConfig, function(err, stats) {

                cb(err);
            });
        }
    });
}

function build(isRelease){

    var cmd = "tsc";

    if(isRelease)
        cmd = cmd + " --declaration";
    else
        cmd = cmd + " --sourceMap";

    util.series(["npm run clean",cmd], function (err) {

        if(err)
        {
            console.log(err);
            process.exit(1);
        }
        else
        {
            if(isRelease)
            {
                cpy(["**/*.js","**/*.d.ts"],"../dist",{cwd:process.cwd()+"/src",parents: true, nodir: true}).then(function(){

                    createStandAlone(function (err) {

                        if(err)
                        {
                            console.log(err);
                            process.exit(1);
                        }
                        else
                        {
                            process.exit(0);
                        }
                    })

                },function(err){

                    console.log(err);
                    process.exit(1);
                })
            }

        }
    });

}

