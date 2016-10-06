var fs = require('fs');
var path = require('path');

var conf= {
  SYSTEM_NAME: 'visav',
  SYSTEM_EMAIL: 'info@visav.io',
  APP_ID: 'com.krisandbrake.visav',
  APP_DESCRIPTION: 'Visav iOS',
  APP_NAME: 'Visav iOS',
  APP_OWNER: 'Ethan Vaughan',
  AWS_IOT_CONFIG: {
    accessKeyId: 'AKIAJMXV7C4RR4AVLVUQ',
    secretAccessKey: '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',
    endpointAddress: 'azf5xkj2sjl2t.iot.us-west-2.amazonaws.com',
    region: 'us-west-2'
  }
}

if (process.env.NODE_ENV!=='production') {
  conf.SYSTEM_NAME = 'visav-'.concat(process.env.NODE_ENV)
}

if (process.env.PHONE_APP_NAME != 'visav') {
  conf.APP_ID = 'com.krisandbrake.Phlex';
  conf.APP_DESCRIPTION = 'Phlex RS';
  conf.APP_NAME = 'Phlex RS';
  conf.APP_OWNER = 'Ethan Vaughan';
}

//--- Helper functions ---

function readCredentialsFile(name) {  
  return fs.readFileSync(
    path.resolve(__dirname, 'server/credentials', name),
    'UTF-8'
  );
}

// Apple Push Notification Certificates
var apnsEnvIdentifier = (process.env.NODE_ENV==='development' ? 'dev' : 'prod');
conf.apnsCertData = readCredentialsFile(process.env.PHONE_APP_NAME+'_'+apnsEnvIdentifier+'_cert.pem');
conf.apnsKeyData = readCredentialsFile(process.env.PHONE_APP_NAME+'_'+apnsEnvIdentifier+'_key.pem');

// Google Push Notifications
// Use your own Server Key as generated by Google Developer Console
// For more details, see http://developer.android.com/google/gcm/gs.html
// conf.gcmServerApiKey = 'Your-server-api-key';

module.exports = conf;
