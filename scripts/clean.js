

var del = require('del');
var projectConfig = require('../project.config');

var paths = del.sync([
    'coverage',
    projectConfig.srcDir +'/**/*.js',
    projectConfig.srcDir +'/**/*.map',
    projectConfig.testsDir+"/**/*.js",
    projectConfig.testsDir +'/**/*.map',
    projectConfig.distDir,projectConfig.distDirTemp]);

console.log('Deleted files/folders:\n', paths.join('\n'));


