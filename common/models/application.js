var globalConfig = require('../../global.config');

module.exports = function(Application) {
  Application.observe('before save', function(ctx, next) {
    var modelInstance = ctx.instance;
    if (modelInstance.name === globalConfig.APP_NAME) {
      modelInstance.id = globalConfig.APP_ID;
    }
    next();
  });
}
