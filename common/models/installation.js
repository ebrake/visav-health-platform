
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
      return cb(err,install);
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
