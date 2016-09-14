import fetch from 'node-fetch';
import plivo from 'plivo';

module.exports = function(Message) {
  Message.send = function(req, res, cb) {    
    var { type, deliveryMethod, sender, recipient } = req.body;
    var err;
    if (!deliveryMethod) {
      //find users preferred messaging type for the message's deliveryMethod
      //ex. Dr. X like texts for health events
      //for now, hardcoding default
      deliveryMethod='email';
    }
    if (type && sender && recipient) {
      if (type == "healthEvent") {
        if (req.body.healthEvent) {
          var requestBody = JSON.stringify({
            healthEvent: req.body.healthEvent,
            doctor: recipient,
            patient: sender,
            deliveryMethod: deliveryMethod
          });
          fetch(process.env.API_ROOT+'api/healthEventMessages/send', {
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
            return cb(null, { status: 'success' });
          });
        }
        else{
          //healthEvent is required
          err = new Error('A valid health event is required for messages with type=healthEvent.');
          err.statusCode = 417;
          err.code = 'MESSAGE_SEND_FAILED_MISSING_REQUIREMENTS';
          return cb(err, { status: 'failure', message: err.message });
        }
      }
      else{
        err = new Error('Unrecognized message type: ' + type);
        err.statusCode = 422;
        err.code = 'MESSAGE_SEND_FAILED_INVALID_REQUIREMENTS';
        return cb(err, { status: 'failure', message: err.message });
      }
    }
    else{
      err = new Error('Valid type, sender and receiver are required');
      err.statusCode = 417;
      err.code = 'MESSAGE_SEND_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
  };

  Message.sendEmail = function(req, res, cb) {
    var { recipient, html, subject } = req.body;
    var err;
    if (!recipient) {
      err = new Error('Valid recipient required');
      err.statusCode = 417;
      err.code = 'EMAIL_SEND_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!recipient.email){
      err = new Error('Valid email required on recipient.email');
      err.statusCode = 422;
      err.code = 'EMAIL_SEND_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    if(!html) html = '';

    var subjectText;
    if (subject) {
      subjectText = ': ' + subject;
    }

    var Email = req.app.models.Email;

    Email.send({
      to: recipient.email,
      from: req.app.globalConfig.SYSTEM_EMAIL,
      subject: req.app.globalConfig.APP_NAME + subjectText,
      html: html
    }, function(err) {
      if (err){
        return cb(err, { status: 'failure', message: err.message });
      }
      return cb(null, { status: 'success' });
    });
  };

  Message.sendText = function(req, res, cb) {
    //send text
    var { recipient, contentString } = req.body;

    if (!recipient) {
      err = new Error('Valid recipient required.');
      err.statusCode = 417;
      err.code = 'TEXT_SEND_FAILED_MISSING_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }
    else if (!recipient.phone){
      err = new Error('Valid phone number required on recipient.phone');
      err.statusCode = 422;
      err.code = 'TEXT_SEND_FAILED_INVALID_REQUIREMENTS';
      return cb(err, { status: 'failure', message: err.message });
    }

    if(!contentString) contentString = '';

    var plivoApi = plivo.RestAPI({
      authId: process.env.PLIVO_AUTH_ID,
      authToken: process.env.PLIVO_AUTH_TOKEN
    });
    var plivoParams = {
      'src': process.env.PLIVO_SRC_NUMBER, // Sender's phone number with country code
      'dst' : recipient.phone || '12508883312', // Receiver's phone Number with country code
      'text' : contentString || 'Hi, this is a test message from Visav',
    };
    plivoApi.send_message(plivoParams, function (status, response) {
      console.log('Status: ', status);
      console.log('API Response:\n', response);
      console.log('Message UUID:\n', response['message_uuid']);
      console.log('Api ID:\n', response['api_id']);
      return cb(null, { status: 'success' });
    });

  };

  Message.remoteMethod(
    "dismiss",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/dismiss', verb: 'get' },
      returns: { arg: 'data', type: 'array' },
      description: "Makes note the provided message has been dismissed."
    }
  );
  Message.remoteMethod(
    "send",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/send', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an email, text message or notification"
    }
  );
  Message.remoteMethod(
    "sendText",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/sendText', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an email, text message or notification"
    }
  );
  Message.remoteMethod(
    "sendEmail",
    { 
      accepts: [
        { arg: 'req', type: 'object', http: { source: 'req' } },
        { arg: 'res', type: 'object', http: { source: 'res' } },
      ],
      http: { path: '/sendEmail', verb: 'post' },
      returns: { arg: 'data', type: 'array' },
      description: "Send an email, text message or notification"
    }
  );
};
