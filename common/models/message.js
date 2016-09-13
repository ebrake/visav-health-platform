import fetch from 'node-fetch';
import plivo from 'plivo';

module.exports = function(Message) {
  Message.send = function(req, res, cb) {    
    var { type, subtype, sender, recipient } = req.body;
    
    if (!type) {
      //find users preferred messaging type for the message's subtype
      //ex. Dr. X like texts for health events
      //for now, hardcoding default
      type='email';
    }
    if (type && subtype && sender && recipient) {
      if (subtype == "healthEvent") {
        if (req.body.healthEvent) {
          var requestBody = JSON.stringify({
            healthEvent: req.body.healthEvent,
            doctor: recipient,
            patient: sender,
            type: type
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
          });
        }
        else{
          //healthEvent is required
          return;
        }
      }
    }
    else{
      //type and subtype, sender and receiver are required
      return;
    }
  };

  Message.sendEmail = function(req, res, cb) {
    var { recipient, html, subject } = req.body;
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
        console.log(err);
        return;
      }
    });
  };

  Message.sendText = function(req, res, cb) {
    //send text
    var { recipient, contentString } = req.body;
    var plivoApi = plivo.RestAPI({
      authId: process.env.PLIVO_AUTH_ID,
      authToken: process.env.PLIVO_AUTH_TOKEN
    });
    var plivoParams = {
      'src': process.env.PLIVO_SRC_NUMBER, // Sender's phone number with country code
      'dst' : recipient.phone || '12508883312', // Receiver's phone Number with country code
      'text' : contentString || 'Hi, this is a test message from Visav',
    };
    console.log('sending text with params: ');
    console.log(plivoParams);
    plivoApi.send_message(plivoParams, function (status, response) {
      console.log('Status: ', status);
      console.log('API Response:\n', response);
      console.log('Message UUID:\n', response['message_uuid']);
      console.log('Api ID:\n', response['api_id']);
    });

  };

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
