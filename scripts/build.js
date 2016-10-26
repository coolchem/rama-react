

var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var cpy = require("cpy");
var path = require("path");
var fs = require("fs-extra");


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

    var stealTools = require("steal-tools");

    var rootPath = path.resolve("./");
    json = JSON.parse(fs.readFileSync(path.resolve("./package.json"), 'utf8'));
    var version = json.version;
    var moduleName = json.name;

    var mainFilePathArray = json.main.split("/");
    var mainFileName = mainFilePathArray[mainFilePathArray.length-1];

    var standAloneFile = "./standalone/" + moduleName;

    var pathToStandAloneFile = standAloneFile + ".js";
    var pathToStandAloneMinifiedFile = standAloneFile + ".min.js";

    var tempConfigFilePath = path.resolve("./")+"/package_temp.json";
    var tempDirectoryPath = rootPath + "/" + moduleName;
    var tempConfig = json;
    tempConfig.main = moduleName + "/" + mainFileName;

    fs.writeFileSync(tempConfigFilePath,JSON.stringify({main:moduleName + "/" + mainFileName, system:json.system}));


    fs.copySync(rootPath+"/dist",tempDirectoryPath)

    var buildOptions = {
        system: {
            config:tempConfigFilePath+"!npm"
        },
        outputs: {
            "+standalone": {
                dest: pathToStandAloneFile
            }
        }
    };

    stealTools.export(buildOptions).then(function(){

        buildOptions.outputs = {
            "+standalone": {
                dest: pathToStandAloneMinifiedFile,
                minify:true
            }
        };

        //buiding minified version
        stealTools.export(buildOptions).then(function(){
            cleanTempFiles();
            cb()

        },function(err){
            cleanTempFiles();
            cb(err)
        })


    },function(err){
        cleanTempFiles();
        cb(err)
    })


    function cleanTempFiles() {

        fs.removeSync(tempConfigFilePath);
        fs.removeSync(tempDirectoryPath);
    }
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

