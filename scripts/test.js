
var util = require('./util');

if(process.env.TEST_BROWSER)
{

    var testCMD = "karma start";

    testCMD = testCMD + " --browsers " + process.env.TEST_BROWSER;
    util.series([testCMD], function(err){

        if(err)
        {
            console.log(err);
            process.exit(1);
        }

        process.exit(0);
    });
}
else
{

    util.series(["npm run clean","karma start --single-run --no-auto-watch --browsers PhantomJS"], function(err){

        if(err)
        {
            console.log(err);
            process.exit(1);
        }

        process.exit(0);
    });
}


