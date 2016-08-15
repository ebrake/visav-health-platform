// compile .jsx with babel-loader, direct test in client directory.
var context = require.context('../../client/__tests__', true, /-test\.js$/);
context.keys().forEach(context);