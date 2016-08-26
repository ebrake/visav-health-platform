import React, { Component } from 'react';
import scriptLoader from 'react-async-script-loader'
import { config } from 'react-loopback';
import MainHeader from '../headers/MainHeader';
import RepsChartPanel from '../panels/RepsChartPanel';
import PatientInfoPanel from '../panels/PatientInfoPanel';
import AccountStore from '../../alt/stores/AccountStore'
import ImageButton from '../buttons/ImageButton';
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
    let accountState = AccountStore.getState();

    this.state = {
      createSessionResponse: '',
      opentokScriptLoaded: null,
      activeSession:null,
      activePublisher: null,
      activeSubscriberStream: null,
      loggedInUser: accountState.user
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
    var self = this;
    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.createSessionResponse.session.sessionId);
    this.setState({activeSession: session});
    const publisher = OT.initPublisher(this.refs.publisherSection, {
      insertMode:'append',
      width: '100%',
      height: '100%'
    })
    this.setState({activePublisher: publisher});

    session.connect(this.state.createSessionResponse.token, function (error) {
      if (!error) {
        session.publish(publisher);
      }
    });

    session.on({
      connectionCreated: function (event) {
        if (event.connection.connectionId != session.connection.connectionId) {
          console.log('Another client connected.');
        }
      },
      connectionDestroyed: function connectionDestroyedHandler(event) {
        console.log('A client disconnected.');
        self.disconnectFromSession();
      },
    });

    session.on("streamCreated", function (event) {
      session.subscribe(event.stream, self.refs.subscriberSection, {
        width: '100%',
        height: '100%'
      })
      self.setState({activeSubscriberStream: event.stream});
      console.log('Subscribed to stream: ' + event.stream.id)
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
      activePublisher: null,
      activeSubscriberStream: null
    });

  }

  render() {

    var jsLoaded;
    if (this.state.opentokScriptLoaded==null || this.state.opentokScriptLoaded==true) jsLoaded = null;
    else jsLoaded = <p><font color="red">Warning: Video cannot load due to a JavaScript error.</font></p>;

    var overlay;
    if (this.state.activeSession == null) {
      overlay = 
      <div className="overlay">
        <ImageButton onClick={this.createSession.bind(this)} text="Create New Session" imgURL="face-to-face.png" className="btn-create"/>
      </div>
    }
    else{
      overlay = 
      <div className="overlay">
        <ImageButton onClick={this.disconnectFromSession.bind(this)} imgURL="hang-up.png" className="btn-cancel"/>
        <ImageButton onClick={this.callSelf.bind(this)} imgURL="call.png" className="btn-call"/>
      </div>
    }

    var vidContainer;
    if (this.state.activeSubscriberStream == null) {
      vidContainer = 
      <div className="video-container">
        <div className="publisher-container full">
          <section ref="publisherSection"  />
        </div>
        <div className="subscriber-container hidden">
          <section ref="subscriberSection"  />
        </div>
      </div>
    }
    else{
      vidContainer = 
      <div className="video-container">
        <div className="publisher-container thumb">
          <section ref="publisherSection"  />
        </div>
        <div className="subscriber-container full">
          <section ref="subscriberSection"  />
        </div>
      </div>
    }
    
    return (
      <div className="Telesession content-container row-gt-sm">
        <div className="left-column">
          <div className="charts-container" >
            <RepsChartPanel />
            <ExercisesChartPanel />
            <HealthEventsChartPanel />
          </div>
        </div>
        <div className="right-column">
          <div className="telesession-panel panel">
            {jsLoaded}
            {overlay}
            {vidContainer}
          </div>
          <PatientInfoPanel user={this.state.loggedInUser} />

        </div>
        
      </div>
    );
  }
}

export default AuthenticatedPage(Telesession);
