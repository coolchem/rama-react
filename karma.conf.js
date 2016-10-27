
var webpack = require("webpack");
module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: true,

        singleRun: false,
        frameworks: ['jasmine'],

        files:['test/**/*.spec.ts','test/**/*.test.ts'],

        reporters: ['coverage','mocha','kjhtml'],
        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'src/**/*.js': ['coverage'],
            'test/**/*.ts': ['webpack','sourcemap'],
            'test/**/*.tsx': ['webpack','sourcemap']
        },

        webpack: {
            resolve: {
                extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
                modulesDirectories: [
                    "",
                    "src",
                    "node_modules"
                ]
            },
            module: {
                loaders: [
                    // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
                    { test: /\.tsx?$/, loader: 'ts-loader' }
                ]
            },
            plugins: [
                new webpack.SourceMapDevToolPlugin({
                    filename: null, // if no value is provided the sourcemap is inlined
                    test: /\.(ts|js)($|\?)/i // process .js and .ts files only
                })
            ]
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