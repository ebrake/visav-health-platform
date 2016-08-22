var GLOBAL_CONFIG = require('../../global.config');

module.exports = function(Application) {
  Application.beforeSave = function (next) {
    if (this.name === GLOBAL_CONFIG.appName) {
      this.id = GLOBAL_CONFIG.appId;
    }
    next();
  };
  Application.afterSave = function (next){
    Application.register(
      this.userId,
      this.name,
      {
        description: this.description,
        pushSettings: this.pushSettings
      },
      function (err, app) {
        if (err) {
          return next(err);
        }
        return next(null, app);
      }
    );
  }
}
