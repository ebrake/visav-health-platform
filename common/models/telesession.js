var OpenTok   = require('opentok');

module.exports = function(Telesession) {

  Telesession.callUser = function(req, limit, cb) {

    var Notification = req.app.models.notification;
    var PushModel = req.app.models.push;

    var badge = 1;

    // TODO: Find the target user's device registration!
    var pushId = 1;

    var note = new Notification({
      expirationInterval: 3600, // Expires 1 hour from now.
      badge: badge++,
      sound: 'ping.aiff',
      alert: '\uD83D\uDCE7 \u2709 ' + 'Hello',
      messageFrom: 'Ray'
    });

    PushModel.notifyById(pushId, note, function (err) {
      if (err) {
        console.error('Cannot notify %j: %s', req.params.id, err.stack);
        next(err);
        return;
      }
      console.log('pushing notification to %j', req.params.id);
      res.send(200, 'OK');
    });

    PushModel.on('error', function (err) {
      console.error('Push Notification error: ', err.stack);
    });

  }

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
    'createSession',
    {
      http: {path: '/createSession', verb: 'post'},
      returns: {arg: 'telesession', root: true}
    }
  );

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
  )

};
