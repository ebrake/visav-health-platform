import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { config } from 'react-loopback';

@scriptLoader(
  'https://static.opentok.com/v2/js/opentok.min.js'
)

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      createSessionResponse: '',
      opentokScriptLoaded: null
    };
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({opentokScriptLoaded: isScriptLoadSucceed});
    }
  }

  createSession() {

    fetch(
      config.get('baseUrl').concat('Telesessions/createSession'), 
      {
        method: 'POST', 
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({}) 
      }
    ).then(responseObject => responseObject.json())
    .then(response => {
      this.setState({
        createSessionResponse: response
      });
      this.connectToSession();
      console.log(response);
    })
    .catch((err) => {
      this.setState({
        createSessionResponse: err
      });
      console.error(err);
    });
  }

  connectToSession() {

    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.createSessionResponse.session.sessionId);

    const publisher = OT.initPublisher(this.refs.tokboxContainer, {
      insertMode: 'replace',
      width: '100%',
      height: '100%'
    })

    session.connect(this.state.createSessionResponse.token, function (error) {
      if (!error) {
        session.publish(publisher);
      }
    });

  }

  render() {

    var jsLoaded;
    if (this.state.opentokScriptLoaded==null || this.state.opentokScriptLoaded==true) jsLoaded = null;
    else jsLoaded = <p><font color="red">Warning: Video can't load due to a JavaScript error.</font></p>;

    return (
      <div>
        <button onClick={this.createSession.bind(this)}><h1>Create Session</h1></button>
        {jsLoaded}
        <div className="videoContainer">
          <section ref="tokboxContainer" />
        </div>
      </div>
    );
  }
}

export default Telesession;
