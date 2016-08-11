var Promise = require('bluebird');

module.exports = function(Exercise) {
  /* RECEIVE DATA */

  var saveRep = function(rep, person, exercise, Rep) {
    return new Promise(function(resolve, reject){
      var date = rep.date;

      if (typeof date != 'date') {
        try { 
          date = new Date(Number(date));
        } catch(e) { 
          return reject(e); 
        }
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
          //upsert doesn't actually work as we can't make a composite key involving a foreign key in loopback, so just remove it and insert the updated one
          Rep.destroyById(entries[0].id, function(err2){
            if (err2) return reject(err2);
            Rep.create(RepObj, function(err3, createdExercise) {
              if (err3) return reject(err3);
              createdRep.save(function(err4){
                if (err4) return reject(err4);
                console.log("Upserted Rep:");
                console.log(createdRep);
                return resolve(createdRep);
              })
            });
          })
        } else {
          //insert
          Rep.create(RepObj, function(err2, createdHealthdata) {
            if (err2) return reject(err2);
            createdRep.save(function(err3){
              if (err3) return reject(err3);
              console.log("Inserted Rep:");
              console.log(createdRep);
              return resolve(createdRep);
            })
          });
        }
      })
    })
  }

  var saveReps = function(reps, person, exercise, Rep) {
    Promise.all(reps.map(function(rep){
      return saveRep(rep, person, exercise, Rep);
    }))
    .then(function(reps){
      return { exercise: exercise, reps: reps };
    })
    .catch(function(err){
      throw err;
    }) 
  }

  var saveExerciseAndReps = function(exercise, person, Rep) {
    return new Promise(function(resolve, reject){
      var date = exercise.date
        , reps = exercise.reps;

      if (typeof date != 'date') {
        try { 
          date = new Date(Number(date));
        } catch(e) { 
          return reject(e); 
        }
      }    

      if (!date) {
        //we're missing required fields
        return reject(new Error('Mising required field date on an exercise.'));
      }

      Exercise.find({
        where: { person: person.id, date: date }
      }, function(err, entries){
        if (err) {
          return reject(err);
        }

        var ExerciseObj = {
          person: person.id,
          date: date,
          duration: exercise.duration || 0,
          createdDate: new Date(),
          type: exercise.type,
          note: exercise.note || '',
          isDemo: exercise.isDemo || false
        };

        if (entries.length > 0) {
          //upsert doesn't actually work as we can't make a composite key involving a foreign key in loopback, so just remove it and insert the updated one
          Exercise.destroyById(entries[0].id, function(err2){
            if (err2) return reject(err2);
            Exercise.create(ExerciseObj, function(err3, createdExercise) {
              if (err3) return reject(err3);
              createdExercise.save(function(err4){
                if (err4) return reject(err4);
                console.log("Upserted Exercise:");
                console.log(createdExercise);
                return resolve(saveReps(reps, person, createdExercise, Rep));
              })
            });
          })
        } else {
          //insert
          Exercise.create(ExerciseObj, function(err2, createdHealthdata) {
            if (err2) return reject(err2);
            createdExercise.save(function(err3){
              if (err3) return reject(err3);
              console.log("Inserted Exercise:");
              console.log(createdExercise);
              return resolve(saveReps(reps, person, createdExercise, Rep));
            })
          });
        }
      })
    })
  }

  Exercise.receiveData = function(req, data, cb) {
    if (!req.user) {
      return cb(null, { status: 'failure', message: 'Anonymous request (no user to attach to)' });
    } 

    var person = req.user
      , Rep = req.app.models.Rep;

    Promise.all(data.map(function(exercise){
      return saveExerciseAndReps(exercise, person);
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

  Exercise.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { ssource: 'req' } },
        { arg: 'data', type: 'object' }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'result', type: 'object' },
      description: "Accepts an array of exercises (with reps), persists them to the data source"
    }
  );

  /* RETRIEVE DATA */
};
