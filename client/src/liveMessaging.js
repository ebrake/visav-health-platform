import { config } from 'react-loopback';
import AccountStore from './alt/stores/AccountStore';
import AWSMqtt from 'aws-mqtt-client';
import LiveMessagingActions from './alt/actions/LiveMessagingActions';

class LiveMessaging {

  connect(){

    let user = AccountStore.getUser();
    
    // Use email as channel name to subscribe/publish messages to client
    const MQTT_TOPIC = user.email;

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
        logOutput('AWS IoT error: '+err);
        client.end();
    });

    client.on('connect', function () {
      logOutput('AWS IoT connected');    

      client.subscribe(MQTT_TOPIC, { qos: 0 }, function(err) {
        if (err) return logOutput(err);

        var exampleMessage = {"state":{"calling":true}};
        client.publish(MQTT_TOPIC, JSON.stringify(exampleMessage), { qos: 0, retained: false }, function(err) {
          if (err) return logOutput(err);
        });

      });

    });

    client.on('message', function (topic, message, packet) {
        LiveMessagingActions.receivedMessage(topic,message);
    });

    client.on('close', function () {
        logOutput(" AWS IoT disconnected");
    });

  }

}

export default LiveMessaging;

