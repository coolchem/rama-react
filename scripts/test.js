
var util = require('./util');
var argv = require('minimist')(process.argv.slice(2));


if(argv._ && argv._.length > 0) //look release build
{
    var subCommand = argv._[0];
    var browser = "PhantomJS";
    var testCMD = "karma start karma.conf.local.js";
    if(argv._.length == 2)
    {
        browser = argv._[1];
    }
    if(subCommand.toLowerCase() === "local")
    {

        testCMD = testCMD + " --browsers " + browser;
        util.series(["npm run build",testCMD], function(err){

            if(err)
            {
                console.log(err);
                process.exit(1);
            }

            process.exit(0);
        });
    }

}
else //do dev build
{

    util.series(["npm run build","karma start --single-run --no-auto-watch --browsers PhantomJS"], function(err){

        if(err)
        {
            console.log(err);
            process.exit(1);
        }

        process.exit(0);
    });
}


