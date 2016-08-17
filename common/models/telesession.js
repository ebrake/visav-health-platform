var OpenTok   = require('opentok');

module.exports = function(Telesession) {

  Telesession.createSession = function(cb) {

    // Initialize OpenTok
    const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET);

    opentok.createSession(function(err, session) {

      if (err) return cb(err, session);

      Telesession.create({
        sessionId: session.sessionId
      }, function(err, createdSession){

        if (err) return cb(err, session);
      
        var token = session.generateToken({
          expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
        });

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
      returns: {arg: 'telesession', root: true}
    }
  );

  Telesession.createToken = function(req, cb) {

    // Initialize OpenTok
    const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET);

    var token = opentok.generateToken(req.body.sessionId, {
      expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
    });

    var response = {
      token: token
    }
    cb(nil, response);

  }

  Telesession.remoteMethod(
    'createToken',
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: {path: '/createToken', verb: 'post'},
      returns: {arg: 'telesession', root: true}
    }
  );

};
