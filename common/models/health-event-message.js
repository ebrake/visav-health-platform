import Oy from 'oy-vey';
import React from 'react';
import HealthEventNotificationEmail from '../../client/src/components/email-templates/HealthEventNotificationEmail';

module.exports = function(HealthEventMessage) {
  HealthEventMessage.dismiss = function(req, res, cb) {
    var messageId = req.query.healthEventMessageId;
    var err;

    if (!messageId) {
      err = new Error('Expected query value healthEventMessageId is missing.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_MESSAGE_DISSMISS_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    HealthEventMessage.findOne({
      where: { id: messageId }
    })
    .then(function(healthEventMessage){
      if (!healthEventMessage) {
        err = new Error('Could not find HealthEventMessage with id: ' + messageId);
        err.statusCode = 404;
        err.code = 'HEALTH_EVENT_MESSAGE_DISSMISS_FAILED_NULL_FIND';
        throw err;
      }
      else {
        healthEventMessage.dismissed = true;
        return healthEventMessage.save();
      }
    })
    .then(function(healthEventMessage){
      return cb(null, { status: 'success', message: 'Successfully dismissed HealthEventMessage: ' + messageId });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })

    res.redirect(process.env.API_ROOT + 'me');
  };

  HealthEventMessage.takeAction = function(req, res, cb) {
    var messageId = req.query.healthEventMessageId;

    if (!messageId) {
      err = new Error('Expected query value healthEventMessageId is missing.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_MESSAGE_ACTION_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

    HealthEventMessage.findOne({
      where: { id: messageId }
    })
    .then(function(healthEventMessage){
      if (!healthEventMessage) {
        err = new Error('Could not find HealthEventMessage with id: ' + messageId);
        err.statusCode = 404;
        err.code = 'HEALTH_EVENT_MESSAGE_DISSMISS_FAILED_NULL_FIND';
        throw err;
      }
      else {
        healthEventMessage.actionTaken = true;
        return healthEventMessage.save();
      }
    })
    .then(function(healthEventMessage){
      return cb(null, { status: 'success', message: 'Successful action on HealthEventMessage: ' + messageId });
    }, function(err){
      return cb(null, { status: 'failure', message: err.message, error: err });
    })

    res.redirect(process.env.API_ROOT + 'telesession');
  };

  HealthEventMessage.send = function(req, cb) {
    var { patient, doctor, healthEvent, exercise, deliveryMethod } = req.body;
    var Message = req.app.models.Message;
    var err;

    if(!patient || !doctor || !healthEvent){
      err = new Error('A valid patient, doctor and health event are required.');
      err.statusCode = 417;
      err.code = 'HEALTH_EVENT_MESSAGE_FAILED_MISSING_REQUIREMENTS';
      return cb(null, { status: 'failure', message: err.message, error: err });
    }

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
    })
    .then(function(createdMessage){
      return createdMessage.save();
    })
    .then(function(createdMessage){
      var requestBody;
      var apiRoute;
      if (deliveryMethod=='text') {
        //send text
        apiRoute = 'sendText'
        requestBody = {
          recipient: doctor,
          contentString: 'New notification from ' + patient.firstName + ' ' + patient.lastName,
        };
      }
      else {
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
        requestBody = {
          recipient: doctor,
          html: html,
          subject: subject
        };
      }

      var assembledAPIRoute = process.env.API_ROOT + 'api/messages/' + apiRoute;
      var craftedRequest = {
        body: requestBody
      };

      //call Message.sendEmail or Message.sendText
      if (apiRoute)
        Message[apiRoute](craftedRequest, cb);
      else {
        //literally can't reach here, but I feel dangerous doing the [] notation using a variable which was, once, undefined
        err = new Error('An error occurred in health-event-message at HealthEventMessage.send');
        err.statusCode = 422;
        err.code = 'HEALTH_EVENT_MESSAGE_FAILED_COMPUTATIONAL_ISSUE';
        return cb(null, { status: 'failure', message: err.message, error: err });
      }
    })
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
      ],
      http: { path: '/send', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an message about a health event."
    }
  );
};
