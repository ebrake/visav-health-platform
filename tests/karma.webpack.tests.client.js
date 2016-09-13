var context = require.context('../client-dist/__tests__', true, /-test\.js$/);
context.keys().forEach(context);