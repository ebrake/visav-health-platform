
module.exports = function(Installation) {

  Installation.register = function(req, cb) {
    var err;

    if (!req.user) {
      err = new Error('Cannot register for push notifications; Anonymous request (no user to attach to)');
      err.statusCode = 417;
      err.code = 'PUSH_NOTIFICATION_REGISTER_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    } 

    var deviceType = req.body.deviceType;
    var filter = {
      where: {
        deviceType: deviceType,
        userId: req.user.id
      }
    }

    req.body.userId = req.user.id;

    Installation.findOrCreate(filter, req.body)
    .then(function(args){
      var install = args[0];
      var created = args[1];
      if (created) {
        err = new Error('Cannot register for push notifications again; User and device already registered');
        err.statusCode = 422;
        err.code = 'PUSH_NOTIFICATION_REGISTER_FAILED_INVALID_REQUIREMENTS_ALREADY_REGISTERED';
        throw err;
      }

      //upsert doesn't actually work as we can't make a composite key involving a foreign key in loopback, so just remove it and insert the updated one
      return Installation.findById(install.id)
      .then(function(installation){
        //update the properties of this installation by what's on req.body
        for (var attr in installation) {
          if (req.body[attr] && ['id', 'userid'].indexOf(attr.toLowerCase()) < 0) {
            installation[attr] = req.body[attr];
          }
        }
        //save the installation
        return installation.save();
      })
    })
    .then(function(createdInstall){
      console.log('Successfully installed/registered for '+req.user.toJSON().id);
      return cb(null, { status: 'success', installation: createdInstall, message: 'Successfully registered device for push notifications' });
    }, function(err){
      console.log('Failed to install/register for '+req.user.toJSON().id);
      return cb(null, { status: 'failure', message: err.message, error: err });
    })

  }

  Installation.remoteMethod(
    "register",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/register', verb: 'put' },
      returns: { arg: 'data', type: 'object' },
      description: "Upserts an installation"
    }
  );

}
