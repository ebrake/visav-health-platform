var Promise = require('bluebird');

module.exports = function(Exercise) {
  
  /* RECEIVE DATA */
  var saveRep = function(req, rep, person, exercise) {
    var Rep = req.app.models.Rep;
    var date = rep.date;

    if (!date) {
      err = new Error('Valid date required on rep.date');
      err.statusCode = 417;
      err.code = 'REP_CREATE_FAILED_MISSING_REQUIREMENTS';
      throw err;
    }
    if (typeof date != 'date') {
      try {
        date = new Date(date)
      } catch(e) {
        err = new Error('Could not create Date object from rep.date for reason:\n' + e.message);
        err.statusCode = 422;
        err.code = 'REP_CREATE_FAILED_INVALID_REQUIREMENTS';
        throw err;
      }
    }
    if (!person) {
      err = new Error('Valid Person required.');
      err.statusCode = 417;
      err.code = 'REP_CREATE_FAILED_MISSING_REQUIREMENTS';
      throw err;
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'REP_CREATE_FAILED_INVALID_REQUIREMENTS';
      throw err;
    }

    return Rep.find({
      where: { person: person.id, date: date }
    })
    .then(function(entries){
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
        return Rep.findById(entries[0].id)
        .then(function(createdRep){
          createdRep.duration = RepObj.duration;
          createdRep.note = RepObj.note;
          createdRep.isDemo = RepObj.isDemo;
          createdRep.value = RepObj.value;
          createdRep.unit = RepObj.unit;
          createdRep.createdDate = RepObj.date;

          //console.log("Upserted Rep: "+createdRep.id);
          return createdRep.save();
        })
      } else {
        //insert
        return Rep.create(RepObj)
        .then(function(createdRep) {
          return createdRep.save()
        });
      }
    })
  }

  var saveReps = function(req, reps, person, exercise) {
    return Promise.all(reps.map(function(rep){
      return saveRep(req, rep, person, exercise);
    }))
    .then(function(reps){
      return { exercise: exercise, reps: reps };
    })
  }

  var saveExerciseAndReps = function(req, exercise, person) {
    var HealthEvent = req.app.models.HealthEvent;
    var date = exercise.date
    var reps = exercise.reps;

    if (!date) {
      err = new Error('Valid date required on exercise.date');
      err.statusCode = 417;
      err.code = 'EXERCISE_SAVE_FAILED_MISSING_REQUIREMENTS';
      throw err;
    }
    if (typeof date != 'date') {
      try {
        date = new Date(date)
      } catch(e) {
        err = new Error('Could not create Date object from exercise.date for reason:\n' + e.message);
        err.statusCode = 422;
        err.code = 'EXERCISE_SAVE_FAILED_INVALID_REQUIREMENTS';
        throw err;
      }
    }

    return HealthEvent.find({
      where: { person: person.id, exerciseDate: date }
    })
    .then(function(healthevents){
      var healtheventId = healthevents[0] ? healthevents[0].id : false;

      return Exercise.find({
        where: { person: person.id, date: date }
      })
      .then(function(entries){
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
          return Exercise.findById(entries[0].id)
          .then(function(exercise){
            exercise.duration = exerciseObj.duration;
            exercise.type = exerciseObj.type;
            exercise.note = exerciseObj.note;
            exercise.isDemo = exerciseObj.isDemo;
            exercise.createdDate = exerciseObj.createdDate;

            if (!exercise.healthevent) {
              exercise.healthevent = exerciseObj.healthevent;
            }

            return exercise.save();
          })
          .then(function(exercise){
            //console.log("Upserted Exercise: "+exercise.id);
            return saveReps(req, reps, person, exercise);
          })
        } else {
          //insert
          return Exercise.create(exerciseObj)
          .then(function(exercise) {
            return exercise.save();
          })
          .then(function(exercise){
            //console.log("Inserted Exercise: "+exercise.id);
            return saveReps(req, reps, person, exercise);
          })
        }
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
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'EXERCISE_CREATE_FAILED_INVALID_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    if (!exercises || !exercises.length) {
      err = new Error('Valid exercises required.');
      err.statusCode = 417;
      err.code = 'EXERCISES_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    Promise.all(exercises.map(function(exercise){
      //We don't actually have the Exercise model anywhere except on the request, so we need to pass it down the chain
      return saveExerciseAndReps(req, exercise, person);
    }))
    .then(function(exercisesAndReps){
      return cb(null, { status: 'success', message: 'Successfully saved ' + exercisesAndReps.length + ' exercises' });;
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  /*
    Send live message to client (Exercise has updated)
  */
  Exercise.afterRemote('receiveData', function(context, createdObject, next) {
    if (!createdObject || !createdObject.data || createdObject.data.status == 'failure') {
      return next();
    }
    
    // Use "users/{USER_ID}/{actionType}" as topic name to sub/pub messages to client
    var topic = 'users'.concat('/').concat(context.req.person.id).concat('/').concat("dataUpdate");
    var message = JSON.stringify({
      type: 'HealthEvent'
    });

    Exercise.app.mqttClient.publish(topic, message, {
      qos: 0,
      retained: false
    }, function(err) {
      if (err) console.log("MQTT Publish error, topic: %s: "+err);
      next();
    });
  });

  Exercise.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts an array of exercises (with reps), persists them to the data source"
    }
  );

  /* RETRIEVE DATA */

  Exercise.retrieveData = function(req, cb) {
    var id = req.query.person ? req.query.person : req.user.toJSON().id;
    if (!id) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_GET_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    Exercise.find({
      where: { person: id },
      include: 'reps',
      order: "date ASC",
      limit: 1000,
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message, error: err });
      return cb(null, { status: 'success', exercises: data });
    });
  }

  Exercise.remoteMethod(
    "retrieveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves Exercises for this user."
    }
  )
};
