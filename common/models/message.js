import fetch from 'node-fetch';
module.exports = function(Message) {
  Message.send = function(req, res, cb) {
    console.log('MESSAGE SEND HIT');
    var { type, subtype, sender, recipient } = req.body;

    if (type && subtype && sender && recipient) {
      if (type == "email") {
        if (subtype == "healthEvent") {
          if (req.body.healthEvent) {
            var requestBody = JSON.stringify({
              healthEvent: req.body.healthEvent,
              doctor: recipient,
              patient: sender
            });
            fetch(process.env.API_ROOT+'api/healthEventEmails/send', {
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
      else if (type == "text"){
        if (subtype == "healthEvent") {

        }
      }
      else if (type == "push"){
        if (subtype == "call") {

        }
      }
    }
    else{
      //type and subtype, sender and receiver are required
      return;
    }
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
};
