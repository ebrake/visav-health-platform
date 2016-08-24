var Promise = require('bluebird');

module.exports = function(HealthEvent) {
  var generateHealthEventEmail = function(createdHealthEvents, person, HealthEventEmail) {
    var threshold = 5
      , sendEmail = false;

    HealthEventEmail.find({
      where: { patient: person.id },
      order: 'date DESC'
    }, function(err, foundHealthEvents){
      var lastEmailSentAt = new Date(0);
      if (foundHealthEvents && foundHealthEvents.length > 0) {
        lastEmailSentAt = foundHealthEvents[0].date;
      }
      var healthEvents = [];
      createdHealthEvents.forEach(function(he){
        if (he.date > lastEmailSentAt) healthEvents.push(he);
      })

      //now we execute logic deciding if we send another email on only what is contained in healthEvents
      return Promise.resolve();
    })
  }

  var saveHealthEvent = function(healthEvent, person, Exercise) {
    return new Promise(function(resolve, reject){
      var date = healthEvent.date
        , exerciseDate = healthEvent.exerciseStartDate
        , noExercise = false;

      if (typeof date != 'date') {
        try {
          date = new Date(date)
        } catch(e) { return reject(e); }
      }

      if (!date) {
        return reject(new Error("missing required field date on a HealthEvent"));
      }

      if (typeof exerciseDate != 'date' && exerciseDate != 'NO_EXERCISE') {
        try {
          exerciseDate = new Date(exerciseDate)
        } catch(e) { return reject(e); }
      }

      if (exerciseDate == 'NO_EXERCISE') {
        exerciseDate = new Date();
        noExercise = true;
      } else if (!exerciseDate) {
        exerciseDate = new Date();
      }

      Exercise.find({
        where: { person: person.id, date: exerciseDate }
      }, function(err, exercises){
        if (err) {
          return reject(err);
        }

        var exerciseId = exercises[0] ? exercises[0].id : false;

        HealthEvent.find({
          where: { person: person.id, date: date }
        }, function(err, entries){
          if (err) {
            return reject(err);
          }

          //if we have an exerciseId it's already linked, otherwise we save the exerciseDate so we can try to link it later
          var HealthEventObj = {
            person: person.id,
            exercise: exerciseId ? exerciseId : undefined,
            exerciseDate: noExercise ? undefined : exerciseDate,
            date: date,
            createdDate: new Date(),
            note: healthEvent.note || '',
            isDemo: healthEvent.isDemo || false,
            intensity: healthEvent.intensity || 0,
            perceivedTrend: healthEvent.perceivedTrend || '',
            type: healthEvent.type || ''
          };

          if (entries.length > 0) {
            //upsert (manually)
            HealthEvent.findById(entries[0].id, function(err, createdHealthEvent){
              if (err) return reject(err);

              createdHealthEvent.note = HealthEventObj.note;
              createdHealthEvent.type = HealthEventObj.type;
              createdHealthEvent.intensity = HealthEventObj.intensity;
              createdHealthEvent.perceivedTrend = HealthEventObj.perceivedTrend;
              createdHealthEvent.isDemo = HealthEventObj.isDemo;
              createdHealthEvent.createdDate = HealthEventObj.date;

              if (!createdHealthEvent.exercise) {
                createdHealthEvent.exercise = HealthEventObj.exercise;
              }

              createdHealthEvent.save(function(err){
                if (err) return reject(err);
                console.log("Upserted HealthEvent: "+createdHealthEvent.id);
                return resolve(createdHealthEvent);
              })
            })
          } else {
            //insert
            HealthEvent.create(HealthEventObj, function(err, createdHealthEvent) {
              if (err) return reject(err);
              createdHealthEvent.save(function(err){
                if (err) return reject(err);
                console.log("Inserted HealthEvent: "+createdHealthEvent.id);
                return resolve(createdHealthEvent);
              })
            });
          }
        })
      })
    })
  }  

  HealthEvent.receiveData = function(req, data, cb) {
    if (!req.user || !req.user.id) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user
      , Exercise = req.app.models.Exercise
      , HealthEventEmail = req.app.models.HealthEventEmail;

    Promise.all(data.map(function(healthEvent){
      //We don't actually have the Rep model anywhere except on the request, so we need to pass it down the chain
      return saveHealthEvent(healthEvent, person, Exercise);
    }))
    .then(function(createdHealthEvents){
      cb(null, { status: 'success' });
      //note the use of side effects; look into putting this cb at the end of the promise chain if strange bugs arise in this code
      return generateHealthEventEmail(createdHealthEvents, person, HealthEventEmail);
    })
    .then(function(emailResults){
      console.log("Email results:");
      console.log(emailResults);
      return null;
    })
    .catch(function(err){
      console.log("Issue creating HealthEvent data:");
      console.log(err);
      return cb(null, { status: 'failure', message: err.message });
    }) 
  }

  HealthEvent.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'data', type: 'object' }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'result', type: 'object' },
      description: "Accepts an array of HealthEvents and persists them to the data source"
    }
  );

  /* RETRIEVE DATA */

  var retrieveLimit = 1000;

  HealthEvent.retrieveData = function(req, limit, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user;

    HealthEvent.find({
      where: { person: person.id },
      include: 'exercise',
      order: "date DESC",
      limit: limit || retrieveLimit
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message });
      return cb(null, { status: 'success', healthEvents: data });
    });
  }

  HealthEvent.remoteMethod(
    "retrieveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'limit', type: 'number' }
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves HealthEvents for this user, up to the last <limit> or "+retrieveLimit+" instances."
    }
  )
};
