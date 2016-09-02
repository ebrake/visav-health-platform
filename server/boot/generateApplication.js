var globalConfig = require('../../global.config');

module.exports = function generateApplication(app) {

  let phlexApp = {
    id:             globalConfig.APP_ID,
    name:           globalConfig.APP_NAME,
    description:    globalConfig.APP_DESCRIPTION,
    owner:          globalConfig.APP_OWNER,
    pushSettings: {
      apns: {
        certData:   globalConfig.apnsCertData,
        keyData:    globalConfig.apnsKeyData,
        production: (process.env.NODE_ENV!=='development'),
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

  app.models.Application.findById(phlexApp.id, function(err, application){
    if (err) return console.log("Application findById error: ",err);
    if (!application) return app.models.Application.create(phlexApp);

    // Update
    application.description = phlexApp.description;
    application.name = phlexApp.name;
    application.userId = phlexApp.userId;
    application.pushSettings = phlexApp.pushSettings;

    application.save(function(err){
      if (err) console.log("Application save error: ",err);
    })

  });
  
};
