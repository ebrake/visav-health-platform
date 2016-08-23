import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { config } from 'react-loopback';
import MainHeader from '../headers/MainHeader';
import RepsChartPanel from '../panels/RepsChartPanel';
import ExercisesChartPanel from '../panels/ExercisesChartPanel';
import NotificationActions from '../../alt/actions/NotificationActions';
import HealthEventsChartPanel from '../panels/HealthEventsChartPanel';
import ExerciseActions from '../../alt/actions/ExerciseActions';
import AuthenticatedPage from './AuthenticatedPage';

@scriptLoader(
  'https://static.opentok.com/v2/js/opentok.min.js'
)

class Telesession extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      createSessionResponse: '',
      opentokScriptLoaded: null,
      activeSession:null,
      activePublisher: null
    };
    this.callSelf = this.callSelf.bind(this);

  }

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({opentokScriptLoaded: isScriptLoadSucceed});
    }
  }

  createSession() {

    fetch(
      process.env.API_ROOT + 'api/Telesessions/createSession', 
      {
        method: 'POST', 
        headers: new Header({
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({}) 
      }
    ).then(responseObject => responseObject.json())
    .then(response => {
      this.setState({
        createSessionResponse: response
      });
      this.connectToSession();
      //console.log(response);
    })
    .catch((err) => {
      this.setState({
        createSessionResponse: err
      });
      console.error(err);
    });
  }

  callSelf() {
    NotificationActions.callSelf(this.state.createSessionResponse.session.sessionId);
  }

  connectToSession() {

    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.createSessionResponse.session.sessionId);
    this.setState({activeSession: session});
    const publisher = OT.initPublisher(this.refs.tokboxContainer, {
      insertMode: 'replace',
      width: '100%',
      height: '100%'
    })
    this.setState({activePublisher: publisher});

    session.connect(this.state.createSessionResponse.token, function (error) {
      if (!error) {
        session.publish(publisher);
      }
    });

  }

  disconnectFromSession(){
    const session = this.state.activeSession;
    if (session) {
      session.unpublish(this.state.activePublisher);
      session.disconnect();
    }
    this.setState({
      activeSession: null,
      activePublisher: null
    });

  }

  render() {

    var jsLoaded;
    if (this.state.opentokScriptLoaded==null || this.state.opentokScriptLoaded==true) jsLoaded = null;
    else jsLoaded = <p><font color="red">Warning: Video cannot load due to a JavaScript error.</font></p>;
    var createSessionButton;
    var callButton;
    var theatre
    if (this.state.activeSession == null) {
      createSessionButton = 
        <button onClick={this.createSession.bind(this)} className="create-session-button">
          <h1>Create New Session</h1>
        </button>;
      theatre = null;
    }
    else{
      createSessionButton = null;
      theatre =
        <div className="theatre">
          <div className="theatre-overlay">
            <button onClick={this.disconnectFromSession.bind(this)} className="create-session-button">
              <h1>Cancel Session</h1>
            </button>
            <button onClick={this.callSelf} className="create-session-button">
              <h1>Call Self</h1>
            </button>
          </div>
          <div className="video-container">
            <div className="video">
              <section ref="tokboxContainer" />
            </div>
          </div>
        </div>
    }

    return (
      <div className="Telesession content-container row-gt-md">
        <div className="telesession-container">
          {createSessionButton}
          {jsLoaded}
          {theatre}
        </div>
        <div className="charts-container">
          <RepsChartPanel />
          <ExercisesChartPanel />
          <HealthEventsChartPanel />
        </div>
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
