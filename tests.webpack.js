var context = require.context('./client/src', true, /-test\.js$/);
context.keys().forEach(context);