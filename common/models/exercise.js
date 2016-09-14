var Promise = require('bluebird');

module.exports = function(Exercise) {
  /* RECEIVE DATA */

  var saveRep = function(req, rep, person, exercise) {
    return new Promise(function(resolve, reject){
      var Rep = req.app.models.Rep;
      var date = rep.date;

      if (!date) {
        err = new Error('Valid date required on rep.date');
        err.statusCode = 417;
        err.code = 'REP_CREATE_FAILED_MISSING_REQUIREMENTS';
        return reject(err);
      }
      if (typeof date != 'date') {
        try {
          date = new Date(date)
        } catch(e) {
          err = new Error('Could not create Date object from rep.date for reason:\n' + e.message);
          err.statusCode = 422;
          err.code = 'REP_CREATE_FAILED_INVALID_REQUIREMENTS';
          return reject(err);
        }
      }
      if (!person) {
        err = new Error('Valid person required.');
        err.statusCode = 417;
        err.code = 'REP_CREATE_FAILED_MISSING_REQUIREMENTS';
        return cb(err, { status: 'failure', message: err.message });
      }
      else if (!person.id){
        err = new Error('Valid id required on person.id');
        err.statusCode = 422;
        err.code = 'REP_CREATE_FAILED_INVALID_REQUIREMENTS';
        return cb(err, { status: 'failure', message: err.message });
      }

      Rep.find({
        where: { person: person.id, date: date }
      }, function(err, entries){
        if (err) {
          return reject(err);
        }

        var RepObj = {
          person: person.id,
          exercise: exercise.id,
          date: date,
          duration: rep.duration || 0,
          createdDate: new Date(),
          note: rep.note || '',
          isDemo: rep.isDemo || false,
          value: rep.value,
          unit: rep.unit
        };

        if (entries.length > 0) {
          //upsert (manually) 
          Rep.findById(entries[0].id, function(err, createdRep){
            if (err) return reject(err);

            createdRep.duration = RepObj.duration;
            createdRep.note = RepObj.note;
            createdRep.isDemo = RepObj.isDemo;
            createdRep.value = RepObj.value;
            createdRep.unit = RepObj.unit;
            createdRep.createdDate = RepObj.date;

            createdRep.save(function(err){
              if (err) return reject(err);
              //console.log("Upserted Rep: "+createdRep.id);
              return resolve(createdRep);
            })
          })
        } else {
          //insert
          Rep.create(RepObj, function(err, createdRep) {
            if (err) return reject(err);
            createdRep.save(function(err){
              if (err) return reject(err);
              //console.log("Inserted Rep: "+createdRep.id);
              return resolve(createdRep);
            })
          });
        }
      })
    })
  }

  var saveReps = function(req, reps, person, exercise) {
    return Promise.all(reps.map(function(rep){
      return saveRep(req, rep, person, exercise);
    }))
    .then(function(reps){
      return { exercise: exercise, reps: reps };
    })
    .catch(function(err){
      throw err;
    }) 
  }

  var saveExerciseAndReps = function(req, exercise, person) {
    return new Promise(function(resolve, reject){
      var HealthEvent = req.app.models.HealthEvent;
      var date = exercise.date
      var reps = exercise.reps;

      if (!date) {
        err = new Error('Valid date required on exercise.date');
        err.statusCode = 417;
        err.code = 'EXERCISE_SAVE_FAILED_MISSING_REQUIREMENTS';
        return reject(err);
      }
      if (typeof date != 'date') {
        try {
          date = new Date(date)
        } catch(e) {
          err = new Error('Could not create Date object from exercise.date for reason:\n' + e.message);
          err.statusCode = 422;
          err.code = 'EXERCISE_SAVE_FAILED_INVALID_REQUIREMENTS';
          return reject(err);
        }
      }

      HealthEvent.find({
        where: { person: person.id, exerciseDate: date }
      }, function(err, healthevents){
        if (err) return reject(err);
        var healtheventId = healthevents[0] ? healthevents[0].id : false;

        Exercise.find({
          where: { person: person.id, date: date }
        }, function(err, entries){
          if (err) return reject(err);

          var exerciseObj = {
            person: person.id,
            healthevent: healtheventId ? healtheventId : undefined,
            date: date,
            duration: exercise.duration || 0,
            createdDate: new Date(),
            type: exercise.type,
            note: exercise.note || '',
            isDemo: exercise.isDemo || false
          };

          if (entries.length > 0) {
            //upsert (manually)
            Exercise.findById(entries[0].id, function(err, exercise){
              if (err) return reject(err);

              exercise.duration = exerciseObj.duration;
              exercise.type = exerciseObj.type;
              exercise.note = exerciseObj.note;
              exercise.isDemo = exerciseObj.isDemo;
              exercise.createdDate = exerciseObj.createdDate;

              if (!exercise.healthevent) {
                exercise.healthevent = exerciseObj.healthevent;
              }

              exercise.save(function(err){
                if (err) return reject(err);
                //console.log("Upserted Exercise: "+exercise.id);
                return resolve(saveReps(req, reps, person, exercise));
              })
            })
          } else {
            //insert
            Exercise.create(exerciseObj, function(err, exercise) {
              if (err) return reject(err);
              exercise.save(function(err){
                if (err) return reject(err);
                //console.log("Inserted Exercise: "+exercise.id);
                return resolve(saveReps(req, reps, person, exercise));
              })
            });
          }
        })
      })
    })
  }

  Exercise.receiveData = function(req, cb) {
    var err;
    var person = req.user;
    var exercises = req.body.data;

    if (!person) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'EXERCISE_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'EXERCISE_CREATE_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    if (!exercises || !exercises.length) {
      err = new Error('Valid exercises required.');
      err.statusCode = 417;
      err.code = 'EXERCISES_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    Promise.all(exercises.map(function(exercise){
      //We don't actually have the Exercise model anywhere except on the request, so we need to pass it down the chain
      return saveExerciseAndReps(req, exercise, person);
    }))
    .then(function(exercisesAndReps){
      return cb(null, { status: 'success', message: 'Successfully saved ' + exercisesAndReps.length + ' exercises' });;
    }, function(err){
      return cb(err, { status: 'failure', message: err.message });
    })
  }

  /* RETRIEVE DATA */

  var retrieveLimit = 1000;

  Exercise.retrieveData = function(req, cb) {
    var limit = req.body.limit || retrieveLimit;
    var person = req.user;
    if (!person) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'EXERCISE_GET_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'EXERCISE_GET_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    Exercise.find({
      where: { person: person.id },
      include: 'reps',
      order: "date ASC",
      limit: limit,
    }, function(err, data){ 
      if (err) return cb(err, { status: 'failure', message: err.message });
      return cb(null, { status: 'success', exercises: data });
    });
  }

  Exercise.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'result', type: 'object' },
      description: "Accepts an array of exercises (with reps), persists them to the data source"
    }
  );

  Exercise.remoteMethod(
    "retrieveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves Exercises for this user, up to the last <limit> or "+retrieveLimit+" instances."
    }
  )
};
