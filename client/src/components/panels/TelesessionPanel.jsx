import React, { Component } from 'react';
import { config } from 'react-loopback';

import TelesessionActions from '../../alt/actions/TelesessionActions';
import NotificationActions from '../../alt/actions/NotificationActions';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import AccountStore from '../../alt/stores/AccountStore';
import ImageButton from '../buttons/ImageButton';

class TelesessionPanel extends React.Component {
  
  constructor(props) {
    super(props);
    let telesessionState = TelesessionStore.getState();
    let accountState = AccountStore.getState();
    var sessionId = telesessionState.sessionId;
    
    this.state = {
      sessionId: sessionId,
      activeSession:null,
      activePublisher: null,
      activeSubscriberStream: null,
      loggedInUser: accountState.user
    };

    this.callSelf = this.callSelf.bind(this);
    this.telesessionChanged = this.telesessionChanged.bind(this);

  }

  createSession() {
    TelesessionActions.createSession();
  }

  callSelf() {
    NotificationActions.callSelf(this.state.sessionId);
  }

  connectToSession() {
    var self = this;
    if (!this.state.sessionId) {
      console.log('No Sesison ID to connect to');
      return;
    }
    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.sessionId);
    this.setState({activeSession: session});
    const publisher = OT.initPublisher(this.refs.publisherSection, {
      insertMode:'append',
      width: '100%',
      height: '100%'
    })
    this.setState({activePublisher: publisher});

    session.connect(TelesessionStore.getState().token, function (error) {
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
        insertMode:'append',
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
  telesessionChanged(telesessionState){
    var sessionId = telesessionState.sessionId;
    if (!sessionId) {
      this.createSession();
    }
    else{
      this.setState({sessionId: sessionId});
      this.connectToSession();
    }
  }
  componentDidMount(){
    TelesessionStore.listen(this.telesessionChanged);
  }

  componentWillUnmount(){
    TelesessionStore.unlisten(this.telesessionChanged);
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
      <div className="TelesessionPanel telesession-panel panel">
        {jsLoaded}
        {overlay}
        {vidContainer}
      </div>
    );
  }
};

export default TelesessionPanel;

