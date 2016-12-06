

var util = require('./util');
var path = require("path");
var fs = require("fs-extra");
var webpack = require("webpack");
var projectConfig = require("../project.config");

function createMinifiedFile(cb){

    var webPackConfig = require("../webpack/prod.config")({env:"production",minify:true});

    webpack(webPackConfig, function(err, stats) {

        cb(err);
    });
}

var isProductionBuild = process.env.NODE_ENV == 'production';

var cmd = "tsc";

if(isProductionBuild)
    cmd = cmd + " --declaration --outDir " +  projectConfig.distDirTemp;
else
    cmd = cmd + " --sourceMap";

util.series(["npm run clean",cmd], function (err) {

    if(err)
    {
        console.log(err);
        process.exit(1);
    }

    if(isProductionBuild)
    {
        util.exec("webpack -p",function (err) {

            if(err)
            {
                console.log(err);
                process.exit(1);
            }

            createMinifiedFile(function (error) {
                if(error)
                {
                    console.log(error);
                    process.exit(1);
                }
                fs.removeSync(projectConfig.distDirTemp);
                process.exit(0);
            })

        })
    }

});

