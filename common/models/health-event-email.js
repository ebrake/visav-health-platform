var globalConfig = require('../../global.config');
import Oy from 'oy-vey';
import React from 'react';
import HealthEventNotificationEmail from '../../client/src/components/email-templates/HealthEventNotificationEmail';

module.exports = function(HealthEventEmail) {
  HealthEventEmail.dismiss = function(req, res, cb) {
    var emailId = req.query.healthEventEmailId

    console.log('DISMISS REQUEST:');
    console.log(req.query.healthEventEmailId);
    HealthEventEmail.findOne({
        where: { id: emailId }
      }, function(err, healthEventEmail){
        if (err) throw err;
        if (healthEventEmail) {
          healthEventEmail.dismissed = true;
          healthEventEmail.save(function(err){
            if (err) console.log(err);
            else{
              console.log('HealthEventEmail with id: ' + emailId + ' was successfully dismissed');
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT EMAIL WITH ID: ' + emailId);
        }
      }
    );
    res.redirect(process.env.API_ROOT + 'me');

  };

  HealthEventEmail.takeAction = function(req, res, cb) {
    var emailId = req.query.healthEventEmailId
    console.log('TAKE ACTION REQUEST:');
    console.log(emailId);
    HealthEventEmail.findOne({
        where: { id: emailId }
      }, function(err, healthEventEmail){
        if (err) throw err;
        if (healthEventEmail) {
          healthEventEmail.actionTaken = true;
          healthEventEmail.save(function(err){
            if (err) console.log(err);
            else{
              console.log('Action was taken on HealthEventEmail with id: ' + emailId);
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT EMAIL WITH ID: ' + emailId);
        }
        
      }
    );

    res.redirect(process.env.API_ROOT + 'telesession');
  };

  HealthEventEmail.send = function(req, res, cb) {
    var { patient, doctor, healthEvent, exercise } = req.body;
    var Email = req.app.models.Email;

    if( patient && doctor && healthEvent){
      HealthEventEmail.create({
        date: new Date(),
        dismissed: false,
        actionTaken: "",
        delivered: false,
        url: 'test123',
        recipient: doctor.id,
        sender: patient.id,
        healthevent: healthEvent.id
      }, function(err, createdEmail) {
        if (err) return;
        createdEmail.save(function(err){
          if (err) return;
          //send email here
          Email.send({
            to: doctor.email,
            from: globalConfig.SYSTEM_EMAIL,
            subject: globalConfig.APP_NAME + ': '+patient.firstName+' '+patient.lastName+' has had an adverse Health Event',
            html: Oy.renderTemplate(
              <HealthEventNotificationEmail healthEventEmail={createdEmail} doctor={doctor} patient={patient} 
                  healthEvent={healthEvent} exercise={exercise}/>, 
              {
                title: 'Health Notification from '+globalConfig.APP_NAME,
                previewText: 'Visav: New Notification from ' + patient.firstName + ' ' + patient.lastName
              }
            )
          }, function(err) {
            if (err){
              console.log(err);
              return;
            }
            createdEmail.delivered = true;
            createdEmail.save();
          });
        });
      }) 
    }
    
  };


  HealthEventEmail.remoteMethod(
    "dismiss",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/dismiss', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note the provided HealthEventEmail has been dismissed."
    }
  );
  HealthEventEmail.remoteMethod(
    "takeAction",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/takeAction', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note that action has been taken on the provided HealthEventEmail, and redirects user to their dashboard."
    }
  );
  HealthEventEmail.remoteMethod(
    "send",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/send', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an email about a health event."
    }
  );
};
