var Promise = require('bluebird');
var GLOBAL_CONFIG = require('../../global.config');
var path = require('path');

import React from 'react';
import Oy from 'oy-vey';
import HealthEventNotificationEmail from '../../client/src/components/email-templates/HealthEventNotificationEmail';

module.exports = function(HealthEvent) {
  var sendHealthEventEmail = function(healthEventAndExercise, person, HealthEventEmail, Email) {
    return new Promise(function(resolve, reject){
      var threshold = .5
        , healthEvent = healthEventAndExercise.healthEvent
        , exercise = healthEventAndExercise.exercise;

      if (healthEvent.intensity > threshold || healthEvent.perceivedTrend.toLowerCase() == 'increasing') {
        HealthEventEmail.create({
          date: new Date(),
          dismissed: false,
          actionTaken: "",
          delivered: false,
          url: 'test123',
          patient: person.id,
          doctor: person.id,
          healthevent: healthEvent.id
        }, function(err, createdEmail) {
          if (err) return reject(err);
          createdEmail.save(function(err){
            if (err) return reject(err);
            //send email here
            Email.send({
              to: person.email,
              from: GLOBAL_CONFIG.SYSTEM_EMAIL,
              subject: 'VISAV: '+person.firstName+' '+person.lastName+' has had an adverse Health Event',
              html: Oy.renderTemplate(
                <HealthEventNotificationEmail healthEventEmail={createdEmail} doctor={person} patient={person} 
                    healthEvent={healthEvent} exercise={exercise}/>, 
                {
                  title: 'Health Notification from VISAV',
                  previewText: 'Your patient has had an adverse health event...'
                }
              )
            }, function(err) {
              if (err) return reject(err);
              createdEmail.delivered = true;
              createdEmail.save();
              resolve('Email sent for HealthEvent '+healthEvent.id+'.');
            });
          });
        }) 
      } else {
        resolve('No email needing to be sent for HealthEvent '+healthEvent.id+'.');
      }
    })
  }

  var generateHealthEventEmails = function(createdHealthEventsAndExercises, person, HealthEventEmail, Email) {
    return new Promise(function(resolve, reject){
      HealthEventEmail.find({
        where: { patient: person.id },
        order: 'date DESC'
      }, function(err, healthEventEmails){
        if (err) return reject(err);
        var lastEmailSentAt = new Date(0);
        if (healthEventEmails && healthEventEmails.length > 0) {
          lastEmailSentAt = healthEventEmails[0].date;
        }
        var healthEvents = [];
        createdHealthEventsAndExercises.forEach(function(obj){
          if (obj.healthEvent.date > lastEmailSentAt) healthEvents.push(obj);
        })

        //now we execute logic deciding if we send another email on only what is contained in healthEvents
        return Promise.all(healthEvents.map(function(obj){
          return sendHealthEventEmail(obj, person, HealthEventEmail, Email);
        }))
        .then(function(results){
          return resolve(results);
        })
        .catch(function(err){
          return reject(err);
        })
      })
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
                return resolve({ healthEvent: createdHealthEvent, exercise: exercises[0] });
              })
            })
          } else {
            //insert
            HealthEvent.create(HealthEventObj, function(err, createdHealthEvent) {
              if (err) return reject(err);
              createdHealthEvent.save(function(err){
                if (err) return reject(err);
                console.log("Inserted HealthEvent: "+createdHealthEvent.id);
                return resolve({ healthEvent: createdHealthEvent, exercise: exercises[0] });
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
      , HealthEventEmail = req.app.models.HealthEventEmail
      , Email = req.app.models.Email;

    Promise.all(data.map(function(healthEvent){
      //We don't actually have the Rep model anywhere except on the request, so we need to pass it down the chain
      return saveHealthEvent(healthEvent, person, Exercise);
    }))
    .then(function(createdHealthEventsAndExercises){
      cb(null, { status: 'success' });
      //note the use of side effects; look into putting this cb at the end of the promise chain if strange bugs arise in this code
      return generateHealthEventEmails(createdHealthEventsAndExercises, person, HealthEventEmail, Email);
    }, function(err){
      console.log("Issue creating HealthEvent data:");
      console.log(err);
      return cb(null, { status: 'failure', message: err.message });
    }) 
    .then(function(emailResults){
      console.log("Email results:");
      console.log(emailResults);
      return null;
    })
    .catch(function(err){
      console.log("Issue sending emails:");
      console.log(err);
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
      order: "date ASC",
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
