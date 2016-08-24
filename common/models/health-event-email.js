module.exports = function(HealthEventEmail) {
  HealthEventEmail.dismiss = function(req, res, cb) {
    var emailId = req.query.healthEventEmailId

    console.log('DISMISS REQUEST:');
    console.log(req.query.healthEventEmailId);
    HealthEventEmail.findOne({
        where: { id: emailId }
      }, function(err, healthEventEmail){
        if (err) throw err;
        if (healthEventEmail) {
          healthEventEmail.dismissed = true;
          healthEventEmail.save(function(err){
            if (err) console.log(err);
            else{
              console.log('HealthEventEmail with id: ' + emailId + ' was successfully dismissed');
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT EMAIL WITH ID: ' + emailId);
        }
      }
    );
    res.redirect(process.env.API_ROOT + 'me');

  };

  HealthEventEmail.takeAction = function(req, res, cb) {
    var emailId = req.query.healthEventEmailId
    console.log('TAKE ACTION REQUEST:');
    console.log(emailId);
    HealthEventEmail.findOne({
        where: { id: emailId }
      }, function(err, healthEventEmail){
        if (err) throw err;
        if (healthEventEmail) {
          healthEventEmail.actionTaken = true;
          healthEventEmail.save(function(err){
            if (err) console.log(err);
            else{
              console.log('Action was taken on HealthEventEmail with id: ' + emailId);
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT EMAIL WITH ID: ' + emailId);
        }
        
      }
    );

    res.redirect(process.env.API_ROOT + 'telesession');
  };

  HealthEventEmail.remoteMethod(
    "dismiss",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/dismiss', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note the provided HealthEventEmail has been dismissed."
    }
  );
  HealthEventEmail.remoteMethod(
    "takeAction",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/takeAction', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note that action has been taken on the provided HealthEventEmail, and redirects user to their dashboard."
    }
  );
};
