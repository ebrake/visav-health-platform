var OpenTok   = require('opentok');

var apiKey = process.env.OPENTOK_API_KEY,
    apiSecret = process.env.OPENTOK_SECRET;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log('You must specify OPENTOK_API_KEY and OPENTOK_SECRET environment variables');
  process.exit(1);
}

module.exports = function(Telesession) {

  Telesession.createSession = function(cb) {

    // Initialize OpenTok
    var opentok = new OpenTok(apiKey, apiSecret);

    opentok.createSession(function(err, session) {
      // var Telesession = app.models.Person;
    	// TODO: Get telesession
    	var response = session;
      if (!err) {
       Telesession.create({
        sessionId: session.sessionId
       }, function(err, createdSession){
        cb(err, response);
        console.log(response);
       });
      }
    });
  }
  
  Telesession.remoteMethod(
    'createSession',
    {
      http: {path: '/createSession', verb: 'post'},
      returns: {arg: 'createSession', type: 'string'}
    }
  );

};
