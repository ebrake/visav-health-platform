var Promise = require('bluebird');

module.exports = function(Healthdata) {

  /* RECEIVE DATA */ 
  //need to create and store a Healthdata instance from an object in the array sent to receiveData
  var persistHealthdataInstance = function(person, rawData, body) {
    return new Promise(function(resolve, reject){
      var startDate = rawData.startDate
      , endDate = rawData.endDate || undefined
      , description = rawData.description || ''
      , data = rawData.data;

      if (typeof startDate != 'date') {
        try { 
          startDate = new Date(Number(startDate));
        } catch(e) { 
          return reject(e); 
        }
      }

      if (endDate && typeof endDate != 'date') {
        try {
          endDate = new Date(Number(body.endDate));
        } catch(e) { 
          endDate = undefined;
        }
      }
        
      
      if (!person) {
        //this shouldn't happen probably as this should be a protected route
        return reject(new Error("No person to attach HealthData to!"));
      }

      if (!startDate || !data) {
        //we're missing required fields
        return reject(new Error('Mising required field '+(!startDate ? 'startDate' : 'data')+''));
      }

      Healthdata.find({
        where: { person: person.id, startDate: startDate }
      }, function(err, entries){
        if (err) {
          return reject(err);
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
          //upsert doesn't actually work as we can't make a composite key involving a foreign key in loopback, so just remove it and insert the updated one
          Healthdata.destroyById(entries[0].id, function(err2){
            if (err2) return reject(err2);
            Healthdata.create(healthObj, function(err3, createdHealthdata) {
              if (err3) return reject(err3);
              createdHealthdata.save(function(err4){
                if (err4) return reject(err4);
                console.log("Upserted HealthData:");
                console.log(createdHealthdata);
                resolve(createdHealthdata);
              })
            });
          })
        } else {
          //insert
          Healthdata.create(healthObj, function(err2, createdHealthdata) {
            if (err2) return reject(err2);
            createdHealthdata.save(function(err3){
              if (err3) return reject(err3);
              console.log("Inserted HealthData:");
              console.log(createdHealthdata);
              return resolve(createdHealthdata);
            })
          });
        }
      })
    })
  }

  Healthdata.receiveData = function(req, data, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user;

    Promise.all(data.map(function(rawHealthdata){
      return persistHealthdataInstance(person, rawHealthdata, req.body);
    }))
    .then(function(results){
      return cb(null, { status: 'success', data: results });
    })
    .catch(function(err){
      console.log("Issue creating healthdata:");
      console.log(err);
      return cb(null, { status: 'failure', message: err.message });
    })

  }

  Healthdata.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'data', type: 'object' }
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
