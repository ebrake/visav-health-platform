var globalConfig = require('../../global.config');

module.exports = function(Application) {
  Application.observe('before save', function(ctx, next) {
    var modelInstance = ctx.instance;
    if (modelInstance.name === globalConfig.APP_NAME) {
      modelInstance.id = globalConfig.APP_ID;
    }
    next();
  });
  Application.observe('after save', function(ctx, next) {
    var modelInstance = ctx.instance;

    Application.resetKeys(modelInstance.id, function(err) {
      if (err) return next(err);
      Application.register(
        modelInstance.owner,
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

  });
}
