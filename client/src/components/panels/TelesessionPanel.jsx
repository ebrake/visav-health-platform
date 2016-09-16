import React, { Component } from 'react';
import TelesessionActions from '../../alt/actions/TelesessionActions';
import NotificationActions from '../../alt/actions/NotificationActions';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import ImageButton from '../buttons/ImageButton';

class TelesessionPanel extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      connectionState: null,
      activeSubscriber: null,
      muteMic: false,
      muteSubscriber: false,
      isMousedOver: false,
    };

    this.callSelf = this.callSelf.bind(this);
    this.telesessionChanged = this.telesessionChanged.bind(this);
    this.toggleMuteMic = this.toggleMuteMic.bind(this);
    this.toggleMuteSubscriber = this.toggleMuteSubscriber.bind(this);
    this.mouseDidEnter = this.mouseDidEnter.bind(this);
    this.mouseDidLeave = this.mouseDidLeave.bind(this);

  }

  createSession() {
    TelesessionActions.createSession();
  }

  callSelf() {
    NotificationActions.callDemoUser(TelesessionStore.getState().sessionId);
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
    // if (!this.state.opentokInitialized){
    //   return (
    //     <div className="TelesessionPanel panel" onMouseEnter={this.mouseDidEnter} onMouseLeave={this.mouseDidLeave}>
    //       <p>Initializing Video...</p>
    //     </div>
    //   )
    // }
    let isMousedOver = this.state.isMousedOver;
    let isActiveSub = (this.state.activeSubscriber != null);
    let isActiveSession = (TelesessionStore.getState().activeSession != null);
    var overlay = 
      <div className={isMousedOver ? 'overlay moused-over' : 'overlay'}>
        <ImageButton onClick={this.disconnectFromSession.bind(this)} imgUrl="hangup.png" className="btn-cancel btn-overlay"/>
        <ImageButton onClick={this.callSelf.bind(this)} imgUrl="call.png" className="btn-call btn-overlay"/>
        <ImageButton onClick={this.toggleMuteMic} imgUrl="mute-mic.png" selected={this.state.muteMic} className="btn-mute-mic btn-overlay" />
        <ImageButton onClick={this.toggleMuteSubscriber} imgUrl="mute.png" selected={this.state.muteSubscriber} className="btn-mute-subscriber btn-overlay" />
      </div>

    var createButton =
      <ImageButton onClick={this.createSession.bind(this)} text="Create New Session" imgUrl="face-to-face.png" disableHoverImage={true} className="btn-create"/>
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
      <div className="TelesessionPanel panel" onMouseEnter={this.mouseDidEnter} onMouseLeave={this.mouseDidLeave}>
        {vidContainer}
      </div>
    );
  }
};

export default TelesessionPanel;

