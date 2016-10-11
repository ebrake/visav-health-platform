module.exports = function(Report) {

  Report.requestPGR = function(req, cb) {
    console.log('Requested PGR');
    var err;
    if (!req.user) {
      err = new Error('Valid req.user (caller) required.');
      err.statusCode = 417;
      err.code = 'REPORT_REQUEST_PGR_FAILED_MISSING_REQUIREMENTS_USER';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if (!req.user.id){
      err = new Error('Valid id required on req.user.id');
      err.statusCode = 422;
      err.code = 'REPORT_REQUEST_PGR_FAILED_INVALID_REQUIREMENTS_USER';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if(!req.body.patientId){
      err = new Error('Valid patientId required on req.body.patientId');
      err.statusCode = 417;
      err.code = 'REPORT_REQUEST_PGR_FAILED_MISSING_REQUIREMENTS_PATIENT';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    var Notification = req.app.models.notification;
    var PushModel = req.app.models.push;
    var Installation = req.app.models.installation;
    var badge = 1;
          
    Installation.findOne({
      where: { userId: req.body.patientId }
    })
    .then(function(installation){
      if (installation) {
        var notification = new Notification({
          expirationInterval: 3600, // Expires 1 hour from now.
          category: "REQUEST_PATIENT_GENERATE_REPORT",
          badge: badge++,
          sound: 'ping.aiff',
          alert: 'Your Doctor is requesting a Report',
          from: {
            firstName: req.user.firstName,
            lastName: req.user.lastName,
            email: req.user.email,
            id: req.user.id
          },
        });

        PushModel.notifyById(installation.id, notification, function (err) {
          if (err) {
            console.log('Issue requesting PGR');
            console.log(err);
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
        console.log('No installation for user '+req.body.patientId);
        err = new Error('The app has not been installed/registered by the patient.');
        err.statusCode = 404;
        err.code = 'REPORT_REQUEST_PGR_FAILED_MISSING_REQUIREMENT_APP_REGISTERED';
        return cb(null, { status: 'failure', message: err.message, error: err });
      }
    })
  }

  Report.remoteMethod(
    "requestPGR",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/requestPGR', verb: 'post' },
      returns: { arg: 'data', type: 'object' },
      description: "Requests a PGR from the patient whose ID must be provided."
    }
  );
  
};
