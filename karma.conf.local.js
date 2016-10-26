module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: false,

        singleRun: false,
        frameworks: ['jasmine','steal-npm'],

        steal:{
            files:['src/**/*.js'],
            testFiles:['test/**/*.js']
        },

        reporters: ['kjhtml'],

        "browsers":['Chrome']
    });
};