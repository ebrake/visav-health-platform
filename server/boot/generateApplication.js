var GLOBAL_CONFIG = require('../../global.config');

module.exports = function generateApplication(app) {

  let phlexApp = {
    id: GLOBAL_CONFIG.appId,
    userId: GLOBAL_CONFIG.applicationUserId,
    name: GLOBAL_CONFIG.appName,
    description: 'Phlex CRS',
    pushSettings: {
      apns: {
        certData: GLOBAL_CONFIG.apnsCertData,
        keyData: GLOBAL_CONFIG.apnsKeyData,
        pushOptions: {
          // Extra options can go here for APN
        },
        feedbackOptions: {
          batchFeedback: true,
          interval: 300
        }
      }
    }
  };

  app.models.Application.findOne({
    where: {
      id: phlexApp.id
    }
  }, function(err, application){
    if (err){
      return;
    }
    if (application) return;
    app.models.Application.create(phlexApp);
  });
  
};
