Error.stackTraceLimit = Infinity;


var modulesContext = require.context('./tests', true, /\.spec\.tsx?$|.test\.tsx?$/);

modulesContext.keys().forEach(modulesContext);
