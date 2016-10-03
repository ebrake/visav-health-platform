import React, { Component } from 'react';
import TelesessionActions from '../../alt/actions/TelesessionActions';
import NotificationActions from '../../alt/actions/NotificationActions';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import ImageButton from '../buttons/ImageButton';

import VisavIcon from '../misc/VisavIcon';

class TelesessionPanels extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      connectionState: null,
      activeSubscriber: null,
      opentokScriptLoaded: true,
      muteMic: false,
      muteSubscriber: false,
      isMousedOver: false,
    };

    this.callPatient = this.callPatient.bind(this);
    this.telesessionChanged = this.telesessionChanged.bind(this);
    this.toggleMuteMic = this.toggleMuteMic.bind(this);
    this.toggleMuteSubscriber = this.toggleMuteSubscriber.bind(this);
    this.mouseDidEnter = this.mouseDidEnter.bind(this);
    this.mouseDidLeave = this.mouseDidLeave.bind(this);

  }

  createSession() {
    TelesessionActions.createSession();
  }

  callPatient() {
    NotificationActions.callUser(TelesessionStore.getState().sessionId, this.props.patient.id);
  }

  connectToSession() {
    var self = this;

    const publisher = OT.initPublisher(self.refs.publisherSection, {
      insertMode:'append',
      style: {buttonDisplayMode: 'off'},
      width: '100%',
      height: '100%'
    })
    publisher.publishAudio(!self.state.muteMic);
      
    const session = TelesessionStore.connectToSession(publisher);
    session.on({
      streamCreated: function(event) {
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
      },
      streamDestroyed: function(event) {
        console.log("Stream " + event.stream.name + " ended. " + event.reason);
      }
    });

  }

  disconnectFromSession(){
    this.setState({
      activeSubscriber: null
    });
    TelesessionStore.disconnectFromSession();
  }

  telesessionChanged(telesessionState) {

    let connStates = TelesessionStore.connStates;

    if (this.state.connectionState!=telesessionState.connectionState) {
      switch(telesessionState.connectionState) {
        case connStates.NO_SESSION_EXISTS:
          this.createSession();
          break;
        case connStates.GOT_SESSION_ID:
          this.connectToSession();
          break;
        case connStates.DISCONNECTED:
          this.setState({
            activeSubscriber: null
          });
          break;
        default:
          break;
      }
      this.setState({connectionState: telesessionState.connectionState});
    }
  }

  componentDidMount(){
    TelesessionStore.listen(this.telesessionChanged);
  }

  componentWillUnmount(){
    TelesessionStore.unlisten(this.telesessionChanged);
  }

  toggleMuteMic(){
    var newVal = !this.state.muteMic;
    this.setState({muteMic: newVal});

    if (TelesessionStore.getState().activePublisher) {
      //publishAudio is opposite of mute
      TelesessionStore.getState().activePublisher.publishAudio(!newVal);
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

  mouseDidEnter(){
    this.setState({'isMousedOver': true});

  }

  mouseDidLeave(){
    this.setState({'isMousedOver': false});
  }

  render() {
    let isMousedOver = this.state.isMousedOver;
    let isActiveSub = (this.state.activeSubscriber != null);
    let isActiveSession = (TelesessionStore.getState().activeSession != null);

    if (this.state.opentokScriptLoaded!=true){
      return (
        <div className="TelesessionPanels">
          <div className="telesession-panel panel" onMouseEnter={this.mouseDidEnter} onMouseLeave={this.mouseDidLeave}>
            <p>Loading Opentok...</p>
          </div>
          <div className="telesession-control-panel panel" />
        </div>
      )
    }
    else{

      var controlPanel = isActiveSession ?
        <div className="vertical-control-panel panel">
          <VisavIcon type="hang-up" onClick={this.disconnectFromSession.bind(this)} className="btn-cancel btn-overlay"/>
          <VisavIcon type="call-patient" onClick={this.callPatient.bind(this)} className="btn-call btn-overlay"/>
          <VisavIcon type={this.state.muteMic ? 'muted-self' : 'unmuted-self'} onClick={this.toggleMuteMic} className="btn-mute-mic btn-overlay" />
          <VisavIcon type={this.state.muteSubscriber ? 'muted-subscriber' : 'unmuted-subscriber'} onClick={this.toggleMuteSubscriber} className="btn-mute-subscriber btn-overlay" />
        </div>
        :
        <div className="vertical-control-panel panel">
          <VisavIcon type="start-telesession" onClick={this.createSession.bind(this)} className="btn-create"/>
        </div>;

      return (
        <div className="TelesessionPanels">
          <div className="telesession-panel panel" onMouseEnter={this.mouseDidEnter} onMouseLeave={this.mouseDidLeave}>
            <div className="video-container">
              <div className={isActiveSub ? 'publisher-container thumb':'publisher-container full'} >
                <section ref="publisherSection"  />
              </div>
              <div className={isActiveSub ? 'subscriber-container full':'subscriber-subscriber hidden'}>
                <section ref="subscriberSection"  />
              </div>
            </div>
          </div>
          { controlPanel }
        </div>
      );
    }
  }
};

export default TelesessionPanels;

