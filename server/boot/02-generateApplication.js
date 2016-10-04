var globalConfig = require('../../global.config');

/**
 * A boot script function that generates the Loopack Application object.
 * @module boot/02-generateApplication
 */
module.exports = function generateApplication(app) {

  let phlexApp = {
    id:             app.globalConfig.APP_ID,
    name:           app.globalConfig.APP_NAME,
    description:    app.globalConfig.APP_DESCRIPTION,
    owner:          app.globalConfig.APP_OWNER,
    pushSettings: {
      apns: {
        certData:   app.globalConfig.apnsCertData,
        keyData:    app.globalConfig.apnsKeyData,
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
    if (!application) {
      return app.models.Application.register(
        phlexApp.owner,
        phlexApp.name,
        {
          description: phlexApp.description,
          pushSettings: phlexApp.pushSettings
        },
        function (err, app) {
          if (err) return console.log('ERROR REGISTERING APPLICATION ' + JSON.stringify(err));
          console.log('SUCCESSFULLY REGISTERED APPLICATION...');
        }
      );
    }

    if (process.env.DO_DANGEROUS_APPLICATION_RESET) {
      // App exists, reset keys
      app.models.Application.resetKeys(phlexApp.id, function(err) {
        if (err) console.log("Application resetKeys error: ",err);

          // Update model
          application.description = phlexApp.description;
          application.name = phlexApp.name;
          application.userId = phlexApp.userId;
          application.pushSettings = phlexApp.pushSettings;

          application.save(function(err){
            if (err) console.log("Application save error: ",err);
            console.log('SUCCESSFULLY RESET & UPDATED APPLICATION...');
          });
      });
    }
  });
  
};
