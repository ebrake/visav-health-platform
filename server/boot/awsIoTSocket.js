import AWSMqtt from 'aws-mqtt-client';

var path = require('path');

function awsIoTSocket(app) {

  app.on('started', () => {

    function logOutput(message) {
      console.log(message);
    }

    const awsOptions = app.globalConfig.AWS_IOT_CONFIG;
    Object.assign(awsOptions, {}); // Ths is how we can assign more config options
    
    const client = new AWSMqtt(awsOptions);
    
    const MQTT_TOPIC = 'calling/person';
    const exampleMessage = {"BACKEND":{"calling":true}};

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
        }, 5000);

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
