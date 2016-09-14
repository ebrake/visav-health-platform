import Oy from 'oy-vey';
import React from 'react';
import HealthEventNotificationEmail from '../../client/src/components/email-templates/HealthEventNotificationEmail';
import fetch from 'node-fetch';

module.exports = function(HealthEventMessage) {
  HealthEventMessage.dismiss = function(req, res, cb) {
    var messageId = req.query.healthEventMessageId;

    console.log('DISMISS REQUEST:');
    console.log(messageId);
    HealthEventMessage.findOne({
        where: { id: messageId }
      }, function(err, healthEventMessage){
        if (err) throw err;
        if (healthEventMessage) {
          healthEventMessage.dismissed = true;
          healthEventMessage.save(function(err){
            if (err) console.log(err);
            else{
              console.log('HealthEventMessage with id: ' + messageId + ' was successfully dismissed');
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT Message WITH ID: ' + messageId);
        }
      }
    );
    res.redirect(process.env.API_ROOT + 'me');

  };

  HealthEventMessage.takeAction = function(req, res, cb) {
    var messageId = req.query.healthEventMessageId
    console.log('TAKE ACTION REQUEST:');
    console.log(messageId);
    HealthEventMessage.findOne({
        where: { id: messageId }
      }, function(err, healthEventMessage){
        if (err) throw err;
        if (healthEventMessage) {
          healthEventMessage.actionTaken = true;
          healthEventMessage.save(function(err){
            if (err) console.log(err);
            else{
              console.log('Action was taken on healthEventMessage with id: ' + messageId);
            }
          });
        }
        else{
          console.log('COULD NOT FIND HEALTH EVENT MESSAGE WITH ID: ' + messageId);
        }
        
      }
    );

    res.redirect(process.env.API_ROOT + 'telesession');
  };

  HealthEventMessage.send = function(req, res, cb) {
    var { patient, doctor, healthEvent, exercise, deliveryMethod } = req.body;

    if( patient && doctor && healthEvent){
      HealthEventMessage.create({
        deliveryMethod: deliveryMethod,
        date: new Date(),
        dismissed: false,
        actionTaken: "",
        delivered: false,
        url: 'test123',
        recipient: doctor.id,
        sender: patient.id,
        healthevent: healthEvent.id
      }, function(err, createdMessage) {
        if (err) return;
        createdMessage.save(function(err){
          if (err) return;
          var requestBody;
          var apiRoute;
          if (deliveryMethod=='text') {
            //send text
            apiRoute = 'sendText'
            requestBody = JSON.stringify({
              recipient: doctor,
              contentString: 'New notification from ' + patient.firstName + ' ' + patient.lastName,
            });
          }
          else{
            //send email
            apiRoute = 'sendEmail'
            var subject = 'New notification from ' + patient.firstName + ' ' + patient.lastName;
            var html = Oy.renderTemplate(
              <HealthEventNotificationEmail healthEventMessage={createdMessage} doctor={doctor} patient={patient} 
                  healthEvent={healthEvent} exercise={exercise}/>, 
              {
                title: subject,
                previewText: subject
              }
            );
            requestBody = JSON.stringify({
              recipient: doctor,
              html: html,
              subject: subject
            });
          }
          
          fetch(process.env.API_ROOT + 'api/messages/' + apiRoute, {
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
              console.log(json);
              createdMessage.delivered = true;
              createdMessage.save();
            });          
        });
      }) 
    }
    
  };


  HealthEventMessage.remoteMethod(
    "dismiss",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/dismiss', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note the provided HealthEventMessage has been dismissed."
    }
  );
  HealthEventMessage.remoteMethod(
    "takeAction",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/takeAction', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note that action has been taken on the provided HealthEventMessage, and redirects user to their dashboard."
    }
  );
  HealthEventMessage.remoteMethod(
    "send",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/send', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an message about a health event."
    }
  );
};
