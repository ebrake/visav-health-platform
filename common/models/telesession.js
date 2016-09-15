var OpenTok   = require('opentok');

module.exports = function(Telesession) {

  Telesession.callUser = function(req, cb) {
    var err;
    if (!req.user) {
      err = new Error('Valid req.user (caller) required.');
      err.statusCode = 417;
      err.code = 'TELE_CALL_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!req.user.id){
      err = new Error('Valid id required on req.user.id');
      err.statusCode = 422;
      err.code = 'TELE_CALL_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    if(!req.body.userId){
      err = new Error('Valid userId (callee) required on req.body.userId');
      err.statusCode = 417;
      err.code = 'TELE_CALL_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    var Notification = req.app.models.notification;
    var PushModel = req.app.models.push;
    var Installation = req.app.models.installation;
    var badge = 1;
          
    Installation.find({where: {userId:req.body.userId}}, function(err, installations){
      let sessionId = req.body.sessionId || 'No Session Id';
      if (installations.length > 0) {
        var installationId = installations[0].id;
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

        PushModel.notifyById(installationId, notification, function (err) {
          if (err)return cb(err, { status: 'failure', message: err.message });
          console.log('pushing notification to %j', installationId);
          return cb(null, { status: 'success', message: 'pushing notification to ' + installationId });
        });

        PushModel.on('error', function (err) {
          console.error('Push Notification error: ', err.stack);
        });

      };
      
    });
  }

  Telesession.createSession = function(cb) {

    // Initialize OpenTok
    const opentok = new OpenTok(process.env.OPENTOK_API_KEY, process.env.OPENTOK_SECRET);

    opentok.createSession(function(err, session) {

      if (err) return cb(err, { status: 'failure', session:session });

      Telesession.create({
        sessionId: session.sessionId
      }, function(err, createdSession){

        if (err) return cb(err, { status: 'failure', session:session });
      
        var token = session.generateToken({
          expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
        });

        var response = {
          status: 'success',
          session: session,
          token: token,
          message:'Successfully created session.'
        }

        return cb(null, response);

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
      return cb(err, { status: 'failure', message: err.message });
    }
    var token = opentok.generateToken(req.body.sessionId, {
      expireTime : (new Date().getTime() / 1000)+(7 * 24 * 60 * 60), // in one week
    });

    var response = {
      status: 'success',
      token: token,
      message: 'token successfully created for session with id: ' + req.body.sessionId
    }
    
    cb(null, response);

  }

  Telesession.remoteMethod(
    'createSession',
    {
      http: {path: '/createSession', verb: 'post'},
      returns: {arg: 'telesession', root: true}
    }
  );

  Telesession.remoteMethod(
    "createToken",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/createToken', verb: 'post' },
      returns: { arg: 'result', root: true },
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
      returns: {arg: 'userCalled', root: true},
      description: "Call a user, sends a push notification"
    }
  );

};
