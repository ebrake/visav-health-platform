
module.exports = function(Installation) {

  Installation.register = function(req, cb) {

    //this is null for me...
    //var id = ctx.req.params.id || null;
    //ctx.req.body.userId = id;

    var userId = 1;
    // TODO: Link to user object, referenced through AUTH HTTP token.

    var deviceType = req.body.deviceType;

    var filter = {
      where: {
        deviceType: deviceType,
        userId: userId
      }
    }

    req.body.userId = userId;

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
