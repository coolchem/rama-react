
var path = require("path");

const config = {};

var rootDir = path.resolve("./");
var srcDirName = "src";
var distDirName = "dist";
var tempDirName = "temp";
var srcDir = rootDir + "/" + srcDirName;
var distDir = rootDir + "/" + distDirName;
var distDirTemp = rootDir + "/" + tempDirName;

var standaloneDir = "bin";

config.srcDirName = srcDirName;
config.rootDir = rootDir;
config.distDir = distDir;
config.distDirTemp = distDirTemp;
config.srcDir = srcDir;

config.bundleMainFile = config.distDirTemp + "/" + srcDirName+ "/index.js";

config.testsDir = rootDir + "/tests";

config.standAloneDir = distDir + '/' + standaloneDir;

module.exports = config;