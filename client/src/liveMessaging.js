import { config } from 'react-loopback';
import AccountStore from './alt/stores/AccountStore';
import AWSMqtt from 'aws-mqtt-client';
import LiveMessagingActions from './alt/actions/LiveMessagingActions';

class LiveMessaging {

  connect(){

    let user = AccountStore.getUser();

    // Use "users/{USER_ID}/{actionType}" as topic name to sub/pub messages to client
    const MQTT_TOPIC = 'users'.concat('/').concat(user.id).concat('/').concat("#");

    function logOutput(message) {
      console.log(message);
    }

    var client = new AWSMqtt({
      accessKeyId:      config.get('AWS_MQTT_ACCESS_KEY'),
      secretAccessKey:  config.get('AWS_MQTT_SECRET_KEY'),
      endpointAddress:  config.get('AWS_MQTT_ENDPOINT_ADDRESS'),
      region:           config.get('AWS_MQTT_REGION')
    });

    client.on('error', function (err) {
        logOutput('MQTT Error: '+err);
        //client.end();
    });

    client.on('connect', function () {
      logOutput('MQTT Connected.');

      client.subscribe(MQTT_TOPIC, { qos: 0 }, function(err) {
        if (err) return logOutput(err);

        logOutput('MQTT Subscribed to Topic: '+MQTT_TOPIC);

        // Example of sending a message
        // var exampleMessage = {"state":{"calling":true}};
        // client.publish(MQTT_TOPIC, JSON.stringify({
          // state:{
          //   calling:true
          // }
        //), { qos: 0, retained: false }, function(err) {
          //   if (err) return logOutput(err);
        // });

      });

    });

    client.on('message', function (topic, data, packet) {

      var messageObj;
      if (data && topic){
        try{
          messageObj = JSON.parse(data.toString());
        }
        catch(err){
          return console.log("MQTT LiveMessaging Error: %s",err);
        }
      }
      else {
        return console.log("MQTT LiveMessaging Topic %s Empty");
      }

      var topicInfo = topic.split("/");
      var actionType = topicInfo[2]; // users/{USER_ID}/{actionType}

      switch (actionType) {
        case "dataUpdate":
          LiveMessagingActions.receivedDataUpdate(messageObj);
          break;
      }

    });

    client.on('close', function () {
        logOutput("MQTT Disconnected.");
    });

  }

}

export default LiveMessaging;

