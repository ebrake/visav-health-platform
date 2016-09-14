var Promise = require('bluebird');
var path = require('path');
import fetch from 'node-fetch';

module.exports = function(HealthEvent) {

  var sendHealthEventMessage = function(req, healthEvent, person) {
    return new Promise(function(resolve, reject){
      var requestBody = JSON.stringify({
          type: 'healthEvent',
          healthEvent: healthEvent,
          sender: person,
          recipient: person
      });
      fetch(process.env.API_ROOT+'api/messages/send', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: requestBody
      })
      .then(function(res) {
          return res.json();
      }).then(function(json) {
          if (json.data && json.data.status == 'success') {
            resolve('Successfully sent email request to /api/messages/send.');
          }
          else{
            var err = new Error('could not send email request to /api/messages/send');
            err.statusCode = 400;
            reject(err);
          }
      })
      .catch(function(err){
        console.log(err);
      });
    })
  }

  var generateHealthEventMessages = function(req, healthEvents, person) {
    return new Promise(function(resolve, reject){
      var HealthEventMessage = req.app.models.HealthEventMessage;
      HealthEventMessage.find({
        where: { patient: person.id },
        order: 'date DESC'
      }, function(err, healthEventEmails){
        if (err) return reject(err);
        var lastEmailSentAt = new Date(0);
        if (healthEventEmails && healthEventEmails.length > 0) {
          lastEmailSentAt = healthEventEmails[0].date;
        }

        healthEvents = healthEvents.filter(healthEvent => {
          return (healthEvent.date > lastEmailSentAt);
        })
        //now we execute logic deciding if we send another email on only what is contained in healthEvents
        return Promise.all(healthEvents.map(function(healthEvent){
          var threshold = .5;
          if (healthEvent.intensity > threshold || healthEvent.perceivedTrend.toLowerCase() == 'increasing') {
            return sendHealthEventMessage(req, healthEvent, person);
          }
          else{
            return 'No email needing to be sent for HealthEvent with id: '+healthEvent.id+'.';
          }
        }))
        .then(function(results){
          resolve(results);
        })
        .catch(function(err){
          return reject(err);
        })
      })
    })
  }

  var saveHealthEvent = function(req, healthEvent, person) {
    return new Promise(function(resolve, reject){
      var Exercise = req.app.models.Exercise;
      var date = healthEvent.date;
      var exerciseDate = healthEvent.exerciseStartDate;
      var noExercise = false;
      var err;
      if (!date) {
        err = new Error('Valid date required on healthEvent.date');
        err.statusCode = 417;
        err.code = 'HEALTH_EVENT_SAVE_FAILED_MISSING_REQUIREMENTS';
        return reject(err);
      }

      if (typeof date != 'date') {
        try {
          date = new Date(date)
        } catch(e) {
          err = new Error('Could not create Date object from healthEvent.date for reason:\n' + e.message);
          err.statusCode = 422;
          err.code = 'HEALTH_EVENT_SAVE_FAILED_INVALID_REQUIREMENTS';
          return reject(err);
        }
      }

      if (typeof exerciseDate != 'date' && exerciseDate != 'NO_EXERCISE') {
        try {
          exerciseDate = new Date(exerciseDate)
        } catch(e) { 
          err = new Error('Could not create Date object from healthEvent.exerciseDate for reason:\n' + e.message);
          err.statusCode = 422;
          err.code = 'HEALTH_EVENT_SAVE_FAILED_INVALID_REQUIREMENTS';
          return reject(err);
        }
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
        if (err) return reject(err);

        var exerciseId = exercises[0] ? exercises[0].id : false;

        HealthEvent.find({
          where: { person: person.id, date: date }
        }, function(err, entries){
          if (err) return reject(err);

          //if we have an exerciseId it's already linked, otherwise we save the exerciseDate so we can try to link it later
          var healthEventObj = {
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
            HealthEvent.findById(entries[0].id, function(err, healthEvent){
              if (err) return reject(err);

              healthEvent.note = healthEventObj.note;
              healthEvent.type = healthEventObj.type;
              healthEvent.intensity = healthEventObj.intensity;
              healthEvent.perceivedTrend = healthEventObj.perceivedTrend;
              healthEvent.isDemo = healthEventObj.isDemo;
              healthEvent.createdDate = healthEventObj.date;

              if (!healthEvent.exercise) {
                healthEvent.exercise = healthEventObj.exercise;
              }

              healthEvent.save(function(err){
                if (err) return reject(err);
                //console.log("Upserted HealthEvent: "+createdHealthEvent.id);
                return resolve(healthEvent);
              })
            })
          } else {
            //insert
            HealthEvent.create(healthEventObj, function(err, healthEvent) {
              if (err) return reject(err);
              healthEvent.save(function(err){
                if (err) return reject(err);
                //console.log("Inserted HealthEvent: "+createdHealthEvent.id);
                return resolve(healthEvent);
              })
            });
          }
        })
      })
    })
  }  

  HealthEvent.receiveData = function(req, cb) {
    
    var person = req.user;
    var healthEvents = req.body.data;
    var err;

    if (!person) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'HEALTH_EVENT_CREATE_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    if (!healthEvents || !healthEvents.length) {
      err = new Error('Valid healthEvents required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    Promise.all(healthEvents.map(function(healthEvent){
      //We don't actually have the Exercise model anywhere except on the request, so we need to pass it down the chain
      return saveHealthEvent(req, healthEvent, person);
    }))
    .then(function(healthEvents){
      //note the use of side effects; look into putting this cb at the end of the promise chain if strange bugs arise in this code
      return generateHealthEventMessages(req, healthEvents, person);
    }) 
    .then(function(emailResults){
      return cb(null, { status: 'success' });;
    }, function(err){
      return cb(err, { status: 'failure', message: err.message });
    })
  }

  HealthEvent.retreiveData = function(req, cb) {
    var person = req.user;
    if (!person) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_GET_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'HEALTH_EVENT_GET_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    HealthEvent.find({
      where: { person: person.id },
      include: 'exercise',
      order: "date ASC",
      limit: req.body.limit || 1000
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message });
      return cb(null, { status: 'success', healthEvents: data });
    });
  }

  HealthEvent.remoteMethod(
    "retreiveData",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
      ],
      http: { path: '/get', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Retrieves HealthEvents for this user, up to the last <req.body.limit> or 1000 instances."
    }
  );

  HealthEvent.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'result', type: 'object' },
      description: "Accepts an array of HealthEvents and persists them to the data source"
    }
  );
};
