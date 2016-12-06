

var exec = require('child_process').exec;
var fs = require("fs");
var path = require("path");

if(fs.existsSync(path.resolve("./coverage")))
{
    exec("cat ./coverage/lcov.info | ./node_modules/.bin/coveralls", function(err, stdOut, stdErr){
        console.log(stdOut);
        console.log(stdErr);
        if(err)
        {
            process.exit(1);
        }

        process.exit(0);
    });
}
else
{
    //means no coverage report was generated
    console.log("Nothing to Report: Coverage info not found");
    process.exit(0);
}


