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
    const opentok = new OpenTok(apiKey, apiSecret);

    opentok.createSession(function(err, session) {
      // var Telesession = app.models.Person;
    	// TODO: Get telesession
      if (err) return cb(err, session);

      Telesession.create({
        sessionId: session.sessionId
      }, function(err, createdSession){

        if (err) return cb(err, session);
      
        var token = opentok.generateToken(session.sessionId);

        var response = {
          session: session,
          token: token
        }

        cb(err, response);

      });

    });
  }
  
  Telesession.remoteMethod(
    'createSession',
    {
      http: {path: '/createSession', verb: 'post'},
      returns: {arg: 'telesession', type: 'string'}
    }
  );

};
