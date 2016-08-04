var OpenTok   = require('opentok');

var apiKey = process.env.OPENTOK_API_KEY,
    apiSecret = process.env.OPENTOK_SECRET;

// Verify that the API Key and API Secret are defined
if (!apiKey || !apiSecret) {
  console.log('You must specify TOKBOX_APIKEY and TOKBOX_SECRET environment variables');
  process.exit(1);
}

module.exports = function(Telesession) {

  Telesession.createSession = function(cb) {

    // Initialize OpenTok
    var opentok = new OpenTok(apiKey, apiSecret);

    opentok.createSession(function(err, session) {

    	// TODO: Get telesession
    	var response = session;
      cb(err, response);
      console.log(response);

    });
  }

};
