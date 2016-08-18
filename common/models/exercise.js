var Promise = require('bluebird');

module.exports = function(Exercise) {
  /* RECEIVE DATA */

  var saveRep = function(rep, person, exercise, Rep) {
    return new Promise(function(resolve, reject){
      var date = rep.date;

      if (typeof date != 'date') {
        try { 
          date = new Date(date);
        } catch(e) { return reject(e); }
      }

      if (!date) {
        //missing required info
        return reject(new Error('Missing required field date on a rep.'));
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
              console.log("Upserted Rep: "+createdRep.id);
              return resolve(createdRep);
            })
          })
        } else {
          //insert
          Rep.create(RepObj, function(err, createdRep) {
            if (err) return reject(err);
            createdRep.save(function(err){
              if (err) return reject(err);
              console.log("Inserted Rep: "+createdRep.id);
              return resolve(createdRep);
            })
          });
        }
      })
    })
  }

  var saveReps = function(reps, person, exercise, Rep) {
    return Promise.all(reps.map(function(rep){
      return saveRep(rep, person, exercise, Rep);
    }))
    .then(function(reps){
      return { exercise: exercise, reps: reps };
    })
    .catch(function(err){
      throw err;
    }) 
  }

  var saveExerciseAndReps = function(exercise, person, Healthevent, Rep) {
    return new Promise(function(resolve, reject){
      var date = exercise.date
        , reps = exercise.reps;

      if (typeof date != 'date') {
        try {
          date = new Date(date);
        } catch(e) { return reject(e); }
      }    

      if (!date) {
        //we're missing required fields
        return reject(new Error('Mising required field date on an exercise.'));
      }

      Healthevent.find({
        where: { person: person.id, exerciseDate: date }
      }, function(err, healthevents){
        if (err) {
          return reject(err);
        }

        var healtheventId = healthevents[0] ? healthevents[0].id : false;

        Exercise.find({
          where: { person: person.id, date: date }
        }, function(err, entries){
          if (err) {
            return reject(err);
          }

          var ExerciseObj = {
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
            Exercise.findById(entries[0].id, function(err, createdExercise){
              if (err) return reject(err);

              createdExercise.duration = ExerciseObj.duration;
              createdExercise.type = ExerciseObj.type;
              createdExercise.note = ExerciseObj.note;
              createdExercise.isDemo = ExerciseObj.isDemo;
              createdExercise.createdDate = ExerciseObj.createdDate;

              if (!createdExercise.healthevent) {
                createdExercise.healthevent = ExerciseObj.healthevent;
              }

              createdExercise.save(function(err){
                if (err) return reject(err);
                console.log("Upserted Exercise: "+createdExercise.id);
                return resolve(saveReps(reps, person, createdExercise, Rep));
              })
            })
          } else {
            //insert
            Exercise.create(ExerciseObj, function(err, createdExercise) {
              if (err) return reject(err);
              createdExercise.save(function(err){
                if (err) return reject(err);
                console.log("Inserted Exercise: "+createdExercise.id);
                return resolve(saveReps(reps, person, createdExercise, Rep));
              })
            });
          }
        })
      })
    })
  }

  Exercise.receiveData = function(req, data, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user
      , Rep = req.app.models.Rep
      , Healthevent = req.app.models.Healthevent;

    Promise.all(data.map(function(exercise){
      //We don't actually have the Rep model anywhere except on the request, so we need to pass it down the chain
      return saveExerciseAndReps(exercise, person, Healthevent, Rep);
    }))
    .then(function(results){
      console.log("Results:");
      console.log(results);
      return cb(null, { status: 'success' });
    })
    .catch(function(err){
      console.log("Issue creating exercise data:");
      console.log(err);
      return cb(null, { status: 'failure', message: err.message });
    }) 
  }

  Exercise.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'data', type: 'object' }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'result', type: 'object' },
      description: "Accepts an array of exercises (with reps), persists them to the data source"
    }
  );

  /* RETRIEVE DATA */

  var retrieveLimit = 1000;

  Exercise.retrieveData = function(req, limit, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user;

    Exercise.find({
      where: { person: person.id },
      include: 'reps',
      order: "date DESC",
      limit: limit || retrieveLimit
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message });
      return cb(null, { status: 'success', exercises: data });
    });
  }

  Exercise.remoteMethod(
    "retrieveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'limit', type: 'number' }
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves Exercises for this user, up to the last <limit> or "+retrieveLimit+" instances."
    }
  )
};
