module.exports = function(Healthdata) {

  /* RECEIVE DATA */ 
  Healthdata.receiveData = function(req, data, startDate, endDate, description, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user
      , endDate = endDate || undefined
      , description = description || '';

    if (typeof startDate != 'date') {
      try { 
        startDate = new Date(Number(req.body.startDate));
      } catch(e) { 
        return cb(null, { status: 'failure', message: e.message }); 
      }
    }

    if (endDate && typeof endDate != 'date') {
      try {
        endDate = new Date(Number(req.body.endDate));
      } catch(e) { 
        endDate = undefined;
      }
    }
      
    
    if (!person) {
      //this shouldn't happen probably as this should be a protected route
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    }

    if (!startDate || !data) {
      //we're missing required fields
      return cb(null, { status: 'failure', message: 'Mising required field '+(!startDate ? 'startDate' : 'data')+'' });
    }

    Healthdata.find({
      where: { person: person.id, startDate: startDate }
    }, function(err, entries){
      if (err) {
        console.log("Start date is an invalid date:");
        console.log(startDate);
        return cb(null, { status: 'failure', message: err.message });
      }


      var healthObj = {
        person: person.id,
        startDate: startDate,
        endDate: endDate,
        createdDate: new Date(),
        data: data,
        description: description
      };

      if (entries.length > 0) {
        //upsert doesn't actually work, so just remove it and let the insert take care of things
        Healthdata.destroyById(entries[0].id, function(err2){
          Healthdata.create(healthObj, function(err3, createdHealthdata) {
            if (err3) return cb(null, { status: 'failure', message: err3.message });
            createdHealthdata.save(function(err4){
              if (err4) return cb(null, { status: 'failure', message: err4.message });
              return cb(null, { status: 'success', data: createdHealthdata });
            })
          });
        })
      } else {
        //insert
        Healthdata.create(healthObj, function(err2, createdHealthdata) {
          if (err2) return cb(null, { status: 'failure', message: err2.message });
          createdHealthdata.save(function(err3){
            if (err3) return cb(null, { status: 'failure', message: err3.message });
            return cb(null, { status: 'success', data: createdHealthdata });
          })
        });
      }
    })

  }

  Healthdata.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'data', type: 'object' },
        { arg: 'startDate', type: 'date' },
        { arg: 'endDate', type: 'date' },
        { arg: 'description', type: 'string' }
      ],
      http: { path: '/create', verb: 'post' },
      returns: { arg: 'result', type: 'object' },
      description: "Creates a new instance of Healthdata, attaches it to the user who made the request, updates if it already exists, persists it to the data source, and returns the created object."
    }
  )

  /* RETRIEVE DATA */

  var retrieveLimit = 1000;

  Healthdata.retrieveData = function(req, limit, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user;

    Healthdata.find({
      where: { person: person.id },
      order: "startDate DESC",
      limit: limit || retrieveLimit
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message });
      return cb(null, { status: 'success', data: data });
    });
  }

  Healthdata.remoteMethod(
    "retrieveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'limit', type: 'number' }
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves HealthData for this user, up to the last <limit> or "+retrieveLimit+" instances."
    }
  )
};
