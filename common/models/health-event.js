var Promise = require('bluebird');
var path = require('path');

module.exports = function(HealthEvent) {
  var sendHealthEventMessage = function(req, healthEvent, person) {
    var Message = req.app.models.Message;

    //this has to return a new Promise and not one of its own because the semantics of that Message.send(req, cb) are pretty crazy. Try and do the code trace if you're looking to exercise the brain! :V
    return new Promise(function(resolve, reject){
      var craftedRequest = {
        body: {
          type: 'healthEvent',
          healthEvent: healthEvent,
          sender: person,
          recipient: person
        }
      };

      Message.send(craftedRequest, function(err, data) {
        if (err)
          return reject(err);

        if (data && data.status == 'success') {
          return resolve('Successfully sent email request to /api/messages/send.');
        }
        else{
          var err = new Error('could not send email request to /api/messages/send');
          err.statusCode = 400;
          return reject(err);
        }
      })
    })
  }

  var generateHealthEventMessages = function(req, healthEvents, person) {
    var HealthEventMessage = req.app.models.HealthEventMessage;

    return HealthEventMessage.find({
      where: { patient: person.id },
      order: 'date DESC'
    })
    .then(function(healthEventEmails){
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
    })
  }

  var saveHealthEvent = function(req, healthEvent, person) {
    var Exercise = req.app.models.Exercise;
    var date = healthEvent.date;
    var exerciseDate = healthEvent.exerciseStartDate;
    var noExercise = false;
    var err;

    if (!date) {
      err = new Error('Valid date required on healthEvent.date');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_SAVE_FAILED_MISSING_REQUIREMENTS';
      throw err;
    }
    if (typeof date != 'date') {
      try {
        date = new Date(date)
      } catch(e) {
        err = new Error('Could not create Date object from healthEvent.date for reason:\n' + e.message);
        err.statusCode = 422;
        err.code = 'HEALTH_EVENT_SAVE_FAILED_INVALID_REQUIREMENTS';
        throw err;
      }
    }

    if (typeof exerciseDate != 'date' && exerciseDate != 'NO_EXERCISE') {
      try {
        exerciseDate = new Date(exerciseDate)
      } catch(e) { 
        err = new Error('Could not create Date object from healthEvent.exerciseDate for reason:\n' + e.message);
        err.statusCode = 422;
        err.code = 'HEALTH_EVENT_SAVE_FAILED_INVALID_REQUIREMENTS';
        throw err;
      }
    }

    if (exerciseDate == 'NO_EXERCISE') {
      exerciseDate = new Date();
      noExercise = true;
    } else if (!exerciseDate) {
      exerciseDate = new Date();
    }

    return Exercise.find({
      where: { person: person.id, date: exerciseDate }
    })
    .then(function(exercises){
      var exerciseId = exercises[0] ? exercises[0].id : false;

      return HealthEvent.find({
        where: { person: person.id, date: date }
      })
      .then(function(entries){
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
          return HealthEvent.findById(entries[0].id)
          .then(function(healthEvent){
            healthEvent.note = healthEventObj.note;
            healthEvent.type = healthEventObj.type;
            healthEvent.intensity = healthEventObj.intensity;
            healthEvent.perceivedTrend = healthEventObj.perceivedTrend;
            healthEvent.isDemo = healthEventObj.isDemo;
            healthEvent.createdDate = healthEventObj.date;

            if (!healthEvent.exercise) {
              healthEvent.exercise = healthEventObj.exercise;
            }

            return healthEvent.save();
          })
        } 
        else {
          //insert
          return HealthEvent.create(healthEventObj)
          .then(function(healthEvent) {
            return healthEvent.save();
          });
        }
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
      return cb(null, { status: 'failure', message: err.message, error: err });
    }
    else if (!person.id){
      err = new Error('Valid id required on person.id');
      err.statusCode = 422;
      err.code = 'HEALTH_EVENT_CREATE_FAILED_INVALID_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    if (!healthEvents || !healthEvents.length) {
      err = new Error('Valid healthEvents required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_CREATE_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    Promise.all(healthEvents.map(function(healthEvent){
      return saveHealthEvent(req, healthEvent, person);
    }))
    .then(function(healthEvents){
      return generateHealthEventMessages(req, healthEvents, person);
    }) 
    .then(function(emailResults){
      return cb(null, { status: 'success', message: 'Successfully created HealthEvents and sent any notification emails' });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })
  }

  /*
    Send live message to client (HealthEvent has updated)
  */
  HealthEvent.afterRemote('receiveData', function(context, createdObject, next) {
    if (!createdObject || !createdObject.data || createdObject.data.status == 'failure') {
      return next();
    }
    var topic = context.req.person.email;
    var message = JSON.stringify({
      "DATA_UPDATE": "HealthEvent"
    });
    HealthEvent.app.mqttClient.publish(topic, message, {
      qos: 0,
      retained: false
    }, function(err) {
      if (err) console.log("MQTT Publish error, topic: %s: "+err);
      next();
    });
  });

  HealthEvent.remoteMethod(
    "receiveData",
    {
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } }
      ],
      http: { path: '/create', verb: 'put' },
      returns: { arg: 'data', type: 'object' },
      description: "Accepts an array of HealthEvents and persists them to the data source"
    }
  );

  HealthEvent.retreiveData = function(req, cb) {
    var id = req.query.person ? req.query.person : req.user.toJSON().id;
    if (!id) {
      err = new Error('Valid person required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_GET_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    HealthEvent.find({
      where: { person: id },
      include: 'exercise',
      order: "date ASC",
      limit: 1000
    }, function(err, data){ 
      if (err) return cb(null, { status: 'failure', message: err.message, error: err });
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
      description: "Retrieves HealthEvents for this user."
    }
  );
};
