module.exports = function(Installation) {

  Installation.remoteCreate = function(req, cb) {
    if (!req.body.deviceToken) return cb(null, { error: new Error('No deviceToken!'), type: 'deviceToken', status: 'error' });
    if (!req.body.deviceType) return cb(null, { error: new Error('No deviceType!'), type: 'deviceType', status: 'error' });
    if (!req.body.appId) return cb(null, { error: new Error('No appId!'), type: 'appId', status: 'error' });

    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 
    var person = req.user;

    Installation.create({
        appId: req.body.appId,
        deviceToken: req.body.deviceToken,
        deviceType: req.body.deviceType,
        created: new Date(),
        modified: new Date(),
        person: person.id,
        status: 'Active'
    }, function (err, result) {
        if (err) {
          return cb(null, { error: err, type: 'signup', status: 'error' });
        }
        console.log('Registration record is created: ', result);
        return cb(null, result);
    });

  }

  Installation.remoteMethod(
    "remoteCreate",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'post' },
      returns: { arg: 'installation', type: 'object' },
      description: "Accepts a registration for push notifications (deviceToken, deviceType, appID, person), returns the created push notification device installation"
    }
  );

  return Installation;

};
