import AWSMqtt from 'aws-mqtt-client';

/**
 * Establish a persistent connection to send MQTT messages
 * @module boot/enableAuthentication
 */
 export default function mqttConnection(app) {

  app.on('started', () => {

    var logOutput = (message) => {
      console.log(message);
    }

    const awsOptions = app.globalConfig.AWS_IOT_CONFIG;
    // Ths is how we can assign more config options
    // Object.assign(awsOptions, {});
    app.mqttClient = new AWSMqtt(awsOptions);

    app.mqttClient.on('error', function (err) {
        logOutput('MQTT Error: '+err);
        //app.mqttClient.end();
    });

    app.mqttClient.on('connect', function () {
      
      logOutput('MQTT Connection Established.');    

      /* Uncomment for MQTT testing,
       or to establish a persistent connection to send MQTT messages
       to all clients, or dedicated devices.
      */

      // app.client.subscribe(MQTT_TOPIC, { qos: 0 }, function(err) {
      //   if (err) return logOutput(err);

      //   setInterval(function() {
      //     var MQTT_TOPIC = 'dev+owner@krisandbrake.com';
      //     var exampleMessage = {
      //       "BACKEND":
      //         {"example":
      //           { "calling":true,
      //             "from":"/server/boot/awsIoTSocket.js"
      //           }
      //         }
      //     };
      //     app.client.publish(MQTT_TOPIC, JSON.stringify(exampleMessage), { qos: 0, retained: false }, function(err) {
      //       if (err) return logOutput(err);
      //     });
      //   }, 5000);

      // });

    });

    app.mqttClient.on('message', function (topic, message, pakcet) {
      logOutput("MQTT Received '"+topic+"'' Message: " + message.toString());
    });

    app.mqttClient.on('close', function () {
        logOutput("MQTT Disconnected");
    });

  });

};
