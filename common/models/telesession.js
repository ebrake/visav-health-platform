var OpenTok   = require('opentok');

/**
 * Managed telesessions
 * @class
 */
module.exports = function(Telesession) {

  Telesession.callUser = function(req, cb) {
    var err;

    if (!req.user) {
      err = new Error('Valid req.user (caller) required.');
      err.statusCode = 417;
      err.code = 'TELE_CALL_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if (!req.user.id){
      err = new Error('Valid id required on req.user.id');
      err.statusCode = 422;
      err.code = 'TELE_CALL_FAILED_INVALID_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if(!req.body.userId){
      err = new Error('Valid userId (callee) required on req.body.userId');
      err.statusCode = 417;
      err.code = 'TELE_CALL_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var Notification = req.app.models.notification;
    var PushModel = req.app.models.push;
    var Installation = req.app.models.installation;
    var badge = 1;
          
    Installation.findOne({
      where: { userId: req.body.userId }
    })
    .then(function(installation){
      let sessionId = req.body.sessionId || 'No Session Id';

      if (installation) {
        var notification = new Notification({
          expirationInterval: 3600, // Expires 1 hour from now.
          category: "CALL_USER",
          badge: badge++,
          sound: 'ping.aiff',
          alert: '\uD83D\uDCDE ' + 'Incoming call',
          from: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            id: req.user.id
          },
          sessionId: sessionId
        });

        PushModel.notifyById(installation.id, notification, function (err) {
          if (err) {
            return cb(null, { status: 'failure', message: err.message, error: err });
          } else {
            console.log('pushing notification to %j', installation.id);
            return cb(null, { status: 'success', message: 'pushing notification to ' + installation.id });
          }
        });

        PushModel.on('error', function (err) {
          console.error('Push Notification error: ', err.stack);
        });
      } else {
        console.log('No installation for user '+req.body.userId);
        err = new Error('The app has not been installed/registered by the user.');
        err.statusCode = 404;
        err.code = 'TELE_CALL_FAILED_MISSING_REQUIREMENT_APP_REGISTERED';
        return cb(null, { status: 'failure', message: err.message, error: err });
      }
    })
  }

  /** @function createSession
    Creates an OpenTok session
   */
  Telesession.createSession = function(cb) {

    const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET);

    /**
      Create the session with relayed mediaMode
      (Use a relayed instead of a routed session, if you have only two participants (or maybe even three) and you are not using archiving.)
      {@link https://www.tokbox.com/developer/guides/create-session/|OpenTok Session Creation Overview}
    */
    opentok.createSession({mediaMode:"relayed"}, function(err, session) {

      if (err) return cb(null, { status: 'failure', session: session, message: err.message, error: err });

      Telesession.create({
        sessionId: session.sessionId
      }, function(err, createdSession){

        if (err) return cb(null, { status: 'failure', session: session, message: err.message, error: err });
      
        var token = session.generateToken({
          expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
        });

        return cb(null, {
          status: 'success',
          session: session,
          token: token,
          message:'Successfully created session.'
        });
      });
    });
  }

  Telesession.createToken = function(req, cb) {
    // Initialize OpenTok
    const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET);
    var err;

    if(!req.body.sessionId){
      err = new Error('Valid sessionId required on req.body.sessionId');
      err.statusCode = 422;
      err.code = 'TELE_CREATE_TOKEN_FAILED_INVALID_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var token = opentok.generateToken(req.body.sessionId, {
      expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
    });
    
    cb(null, {
      status: 'success',
      token: token,
      message: 'token successfully created for session with id: ' + req.body.sessionId
    });

  }

  Telesession.remoteMethod(
    'createSession',
    {
      http: {path: '/createSession', verb: 'post'},
      returns: {arg: 'data', type: 'object' }
    }
  );

  Telesession.remoteMethod(
    "createToken",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/createToken', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Creates a session token"
    }
  );

  Telesession.remoteMethod(
    "callUser",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/callUser', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Call a user, sends a push notification"
    }
  );

};
