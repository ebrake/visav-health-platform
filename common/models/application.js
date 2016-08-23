var GLOBAL_CONFIG = require('../../global.config');

module.exports = function(Application) {
  Application.observe('before save', function(ctx, next) {
    var modelInstance = ctx.instance;
    if (modelInstance.name === GLOBAL_CONFIG.appName) {
      modelInstance.id = GLOBAL_CONFIG.appId;
    }
    next();
  });
  Application.observe('after save', function(ctx, next) {
    var modelInstance = ctx.instance;
    Application.register(
      modelInstance.userId,
      modelInstance.name,
      {
        description: modelInstance.description,
        pushSettings: modelInstance.pushSettings
      },
      function (err, app) {
        if (err) {
          console.log('ERROR REGISTERING APPLICATION ' + JSON.stringify(err));
          return next(err);
        }
        console.log('SUCCESSFULLY REGISTERED APPLICATION...');
        return next(null, app);
      }
    );
  });
}
