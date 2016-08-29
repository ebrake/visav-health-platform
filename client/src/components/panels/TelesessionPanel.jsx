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
      activeSubscriber: null,
      opentokScriptLoaded: null,
      loggedInUser: accountState.user,
      muteMic: false,
      muteSubscriber: false,
      isMousedOver: false,
    };

    this.callSelf = this.callSelf.bind(this);
    this.telesessionChanged = this.telesessionChanged.bind(this);
    this.toggleMuteMic = this.toggleMuteMic.bind(this);
    this.toggleMuteSubscriber = this.toggleMuteSubscriber.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);

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
      style: {buttonDisplayMode: 'off'},
      width: '100%',
      height: '100%'
    })
    publisher.publishAudio(!this.state.muteMic);
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
      const subscriber = session.subscribe(event.stream, self.refs.subscriberSection, {
        insertMode:'append',
        style: {buttonDisplayMode: 'off'},
        width: '100%',
        height: '100%'
      })
      subscriber.subscribeToAudio(!self.state.muteSubscriber);
      self.setState({
        activeSubscriber: subscriber
      });
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
      activeSubscriber: null
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

  componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
    if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
      this.setState({opentokScriptLoaded: isScriptLoadSucceed});
    }
  }

  toggleMuteMic(){
    var newVal = !this.state.muteMic;
    this.setState({muteMic: newVal});

    if (this.state.activePublisher) {
      //publishAudio is opposite of mute
      this.state.activePublisher.publishAudio(!newVal);
    }
    
  }

  toggleMuteSubscriber(){
    var newVal = !this.state.muteSubscriber;
    this.setState({muteSubscriber: newVal});

    if (this.state.activeSubscriber) {
      //subscribeToAudio is opposite of mute
      this.state.activeSubscriber.subscribeToAudio(!newVal);
    }
  }

  mouseOver(){
    this.setState({'isMousedOver': true});

  }

  mouseOut(){
    this.setState({'isMousedOver': false});
  }

  render() {
    var jsLoaded;
    if (this.state.opentokScriptLoaded==null || this.state.opentokScriptLoaded==true) jsLoaded = null;
    else jsLoaded = <p><font color="red">Warning: Video cannot load due to a JavaScript error.</font></p>;
    let isMousedOver = this.state.isMousedOver;
    let isActiveSub = (this.state.activeSubscriber != null);
    let isActiveSession = (this.state.activeSession != null);
    var overlay = 
      <div className={isMousedOver ? 'overlay moused-over' : 'overlay'}>
        <ImageButton onClick={this.disconnectFromSession.bind(this)} imgUrl="hang-up.png" className="btn-cancel"/>
        <ImageButton onClick={this.callSelf.bind(this)} imgUrl="call.png" className="btn-call"/>
        <ImageButton onClick={this.toggleMuteMic} imgUrl="mute-mic.png" selected={this.state.muteMic} className="btn-mute-mic" />
        <ImageButton onClick={this.toggleMuteSubscriber} imgUrl="mute.png" selected={this.state.muteSubscriber} className="btn-mute-subscriber" />
      </div>

    var createButton =
      <ImageButton onClick={this.createSession.bind(this)} text="Create New Session" imgUrl="face-to-face.png" className="btn-create"/>
    var overlayOrCreate = (!isActiveSession)?createButton:overlay;

    var vidContainer = 
      <div className="video-container">
        {overlayOrCreate}
        <div className={isActiveSub ? 'publisher-container thumb':'publisher-container full'} >
          <section ref="publisherSection"  />
        </div>
        <div className={isActiveSub ? 'subscriber-container full':'subscriber-subscriber hidden'}>
          <section ref="subscriberSection"  />
        </div>
      </div>
    
    return (
      <div className="TelesessionPanel panel" onMouseEnter={this.mouseOver} onMouseLeave={this.mouseOut}>
        {jsLoaded}
        {vidContainer}
      </div>
    );
  }
};

export default TelesessionPanel;

