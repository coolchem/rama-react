

var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));
var cpy = require("cpy");
var path = require("path");
var fs = require("fs-extra");

var isDeployBuild = false;

if(argv._ && argv._.length > 0) //look release build
{
    var subCommand = argv._[0];
    if(subCommand.toLowerCase() === "release")
    {

        if(argv.deploy)
            isDeployBuild = true;
        
        build(true);
    }
}
else //do dev build
{
    build();
}

function bundleFiles(cb){

    var stealTools = require("steal-tools");

    json = JSON.parse(fs.readFileSync(path.resolve("./package.json"), 'utf8'));
    var version = json.version;

    try {
        fs.lstatSync(path.resolve("./standalone/rama.js"));
        fs.copySync(path.resolve("./standalone/rama.js"), path.resolve("./standalone") + "/rama"+version+".js");
    }
    catch (e) {
        //continue
    }

    stealTools.export({
        system: {
            config:path.resolve("./")+"/package.json!npm"
        },
        outputs: {
            "+standalone": {
                dest: path.resolve("./standalone") + "/rama.js"
            }
        }
    }).then(function(){

        cb();

    },function(err){
        cb(err)
    })
}

function build(isRelease){

    var cmd = "tsc";

    if(isRelease)
        cmd = cmd + " --declaration";
/*    else
        cmd = cmd + " --inlineSourceMap --inlineSources";*/

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
                    
                    if(!isDeployBuild)
                    {
                        bundleFiles(function (err) {

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
                    }
                    
                },function(err){

                    console.log(err);
                    process.exit(1);
                })
            }

        }
    });

}

