import AWSMqtt from 'aws-mqtt-client';

var path = require('path');

function awsIoTSocket(app) {

  app.on('started', () => {

    function logOutput(message) {
      console.log(message);
    }

    var AWSOpts = {
      accessKeyId: 'AKIAJMXV7C4RR4AVLVUQ',
      secretAccessKey: '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',
      endpointAddress: 'azf5xkj2sjl2t.iot.us-west-2.amazonaws.com',
      region: 'us-west-2'
    }

    const MQTT_TOPIC = 'calling/person';
    const exampleMessage = {"BACKEND":{"calling":true}};

    var client = new AWSMqtt(AWSOpts);

    client.on('error', function (err) {
        logOutput('AWS IoT error: '+err);
        client.end();
    });

    client.on('connect', function () {
      logOutput('AWS IoT connected');    

      client.subscribe(MQTT_TOPIC, { qos: 0 }, function(err) {
        if (err) return logOutput(err);

        setInterval(function() {
          client.publish(MQTT_TOPIC, JSON.stringify(exampleMessage), { qos: 0, retained: false }, function(err) {
            if (err) return logOutput(err);
          });
        }, 1000);

      });

    });

    client.on('message', function (topic, message, pakcet) {
        logOutput("Received '"+topic+"'' Message: " + message.toString());
    });

    client.on('close', function () {
        logOutput(" AWS IoT disconnected");
    });

  });

};

export default awsIoTSocket;
