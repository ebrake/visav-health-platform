import React from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import AWSMqtt from 'aws-mqtt-client';

class LiveSocket extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      clientData: []
    }

  }

  componentDidMount() {

    var self = this;

    function logOutput(message) {
      self.setState({ 
        clientData: self.state.clientData.concat([message])
      });
      console.log(message);
    }

    var AWSOpts = {
      accessKeyId: 'AKIAJMXV7C4RR4AVLVUQ',
      secretAccessKey: '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',
      endpointAddress: 'azf5xkj2sjl2t.iot.us-west-2.amazonaws.com',
      region: 'us-west-2'
    }

    const MQTT_TOPIC = 'calling/person';
    const exampleMessage = {"state":{"calling":true}};

    var client = new AWSMqtt(AWSOpts);

    client.on('error', function (err) {
        logOutput('AWS IoT error: '+err);
        client.end();
    });

    client.on('connect', function () {
      logOutput('AWS IoT connected');    

      client.subscribe(MQTT_TOPIC, { qos: 0 }, function(err) {
        if (err) return logOutput(err);

        client.publish(MQTT_TOPIC, JSON.stringify(exampleMessage), { qos: 0, retained: false }, function(err) {
          if (err) return logOutput(err);
        });

      });

    });

    client.on('message', function (topic, message, pakcet) {
        logOutput("Received '"+topic+"'' Message: " + message.toString());
    });

    client.on('close', function () {
        logOutput(" AWS IoT disconnected");
    });

  }

  render() {

    var divStyle = {
      color: '#ccc'
    };

    return (
      <div>
        <pre style={divStyle}>{JSON.stringify(this.state.clientData, null, 2) }</pre>
      </div>
    );
  }
}

//why is it complaining about this
//eslint-disable-next-line
export default AuthenticatedPage(LiveSocket);
