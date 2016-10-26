module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: false,

        singleRun: false,
        frameworks: ['jasmine','steal-npm'],

        steal:{
          files:['src/**/*.js',"test/**/*.js.map","src/**/*.js.map"],
          testFiles:['test/**/*.js']
        },

        reporters: ['coverage','mocha'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage']
        },

        "browsers":['Chrome'],
        coverageReporter: {
            dir : 'coverage/',
            reporters: [
                { type: 'html', subdir: 'html' },
                { type: 'lcovonly', subdir: 'lcov' },
                { type: 'cobertura', subdir: 'cobertura' }
            ]
        }
    });
};