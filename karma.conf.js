module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: false,

        singleRun: false,
        frameworks: ['jasmine'],

        files:['test/**/*.spec.js','test/**/*.test.js'],

        reporters: ['coverage','mocha','kjhtml'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage'],
            'test/**/*.js': ['webpack']
        },

        webpack: {
            resolve: {
                modulesDirectories: [
                    "",
                    "src",
                    "node_modules"
                ]
            }
        },

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