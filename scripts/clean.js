var del = require('del');

var paths = del.sync(['coverage',
    'src/**/*.js',
    'test/**/*.js',
    'dist',
    'standalone',
    '**/*.map',
    '!node_modules/**/*.map',
    'src/**/*.d.ts',
    '!src/typings/**/*.d.ts',
    'test/**/*.d.ts'
    ]);


console.log('Deleted files/folders:\n', paths.join('\n'));


