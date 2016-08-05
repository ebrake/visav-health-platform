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
      opentokScriptLoaded: 'OPENTOK SCRIPT LOADING...'
    };
  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      if (isScriptLoadSucceed) {
        this.setState({opentokScriptLoaded: 'OPENTOK SCRIPT LOADED!'})
      }
      else {
        this.setState({opentokScriptLoaded: 'OPENTOK SCRIPT NOT LOADED!'})
        this.props.onError()
      }
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
      width: '640px',
      height: '480px'
    })

    session.connect(this.state.createSessionResponse.token, function (error) {
      if (!error) {
        session.publish(publisher);
      }
    });

  }

  render() {
    return (
      <div>
        <button onClick={this.createSession.bind(this)}><h1>Create Session</h1></button>
        <p>{JSON.stringify(this.state.createSessionResponse)}</p>
        <p>{this.state.opentokScriptLoaded}</p>
        <section ref="tokboxContainer">
        </section>
      </div>
    );
  }
}

export default Telesession;
