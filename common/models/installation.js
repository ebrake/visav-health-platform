
module.exports = function(Installation) {

  Installation.register = function(req, cb) {

    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Cannot register push notification; Anonymous request (no user to attach to)' });
    } 

    var deviceType = req.body.deviceType;

    var filter = {
      where: {
        deviceType: deviceType,
        userId: req.user.id
      }
    }

    req.body.userId = req.user.id;

    Installation.findOrCreate(filter, req.body, function(err, install, created) {
      if (err || created) return cb(err,install);
      if (!created) {

        //upsert doesn't actually work as we can't make a composite key involving a foreign key in loopback, so just remove it and insert the updated one
        Installation.destroyById(install.id, function(err2){
          if (err2) return cb(err,null);
          Installation.create(req.body, function(err3, createdInstall) {
            if (err3) return cb(err3,createdInstall);
            return cb(err3,createdInstall);
          });
        })
        
      }
    });

  }

  Installation.remoteMethod(
    "register",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/register', verb: 'put' },
      returns: { arg: 'installation', type: 'object' },
      description: "Upserts an installation"
    }
  );

}
