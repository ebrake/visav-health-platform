import React from 'react';
import { config } from 'react-loopback';

import NotificationActions from '../../alt/actions/NotificationActions';
import TelesessionActions from '../../alt/actions/TelesessionActions';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import AccountStore from '../../alt/stores/AccountStore';
import VideoFeedback from '../misc/VideoFeedback';
import VisavIcon from '../misc/VisavIcon';

class TelesessionPanels extends React.Component {
  
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
      opentokScriptLoaded: true,
      loggedInUser: accountState.user,
      muteMic: false,
      muteSubscriber: false,
      isMousedOver: false,
      sessionRequested: false,
      feedback: {
        type: 'hidden',
        message: ''
      }
    };

    this.handleCallPatient = this.handleCallPatient.bind(this);
    this.telesessionChanged = this.telesessionChanged.bind(this);
    this.handleToggleMuteMic = this.handleToggleMuteMic.bind(this);
    this.handleToggleMuteSubscriber = this.handleToggleMuteSubscriber.bind(this);
    this.handleMouseDidEnter = this.handleMouseDidEnter.bind(this);
    this.handleMouseDidLeave = this.handleMouseDidLeave.bind(this);

  }

  createSession() {
    if (!this.state.sessionRequested) {
      this.setState({ sessionRequested: true });
      TelesessionActions.createSession();
    }
  }

  handleCallPatient() {
    NotificationActions.callUser(this.state.sessionId, this.props.patient.id);
  }

  connectToSession() {
    var self = this;
    if (!this.state.sessionId) {
      console.log('No Session ID to connect to');
      return;
    }
    //eslint-disable-next-line
    const session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.sessionId);
    //eslint-disable-next-line
    const publisher = OT.initPublisher(this.refs.publisherSection, {
      insertMode:'append',
      style: {buttonDisplayMode: 'off'},
      width: '100%',
      height: '100%'
    })
    publisher.publishAudio(!this.state.muteMic);

    session.connect(TelesessionStore.getState().token, function (error) {
      if (!error) {
        session.publish(publisher);
        this.setState({
          activeSession: session,
          activePublisher: publisher
        });
      }
    }.bind(this));

    session.on({
      connectionCreated: function (event) {
        if (event.connection.connectionId !== session.connection.connectionId) {
          console.log('Another client connected.');
        }
      },
      connectionDestroyed: function connectionDestroyedHandler(event) {
        console.log('A client disconnected.');
        console.dir(event);
        self.disconnectFromSession();
      },
      streamCreated: function (event) {
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
      }
    });

  }

  disconnectFromSession(){
    const session = this.state.activeSession;
    if (session) {
      session.unpublish(this.state.activePublisher);
      session.disconnect();

      this.setState({
        activeSession: null,
        activePublisher: null,
        activeSubscriber: null,
        sessionRequested: false
      });
    }
  }

  telesessionChanged(telesessionState){
    var sessionId = telesessionState.sessionId;
    if (!sessionId) {
      this.createSession();
    }
    else {
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

  handleToggleMuteMic(){
    var newVal = !this.state.muteMic;
    this.setState({muteMic: newVal});

    if (this.state.activePublisher) {
      //publishAudio is opposite of mute
      this.state.activePublisher.publishAudio(!newVal);
    }
  }

  handleToggleMuteSubscriber(){
    var newVal = !this.state.muteSubscriber;
    this.setState({muteSubscriber: newVal});

    if (this.state.activeSubscriber) {
      //subscribeToAudio is opposite of mute
      this.state.activeSubscriber.subscribeToAudio(!newVal);
    }
  }

  handleMouseDidEnter(){
    this.setState({ 'isMousedOver': true });
  }

  handleMouseDidLeave(){
    this.setState({ 'isMousedOver': false });
  }

  render() {
    let isActiveSub = (this.state.activeSubscriber !== null);
    let isActiveSession = (this.state.activeSession !== null);

    if (this.state.opentokScriptLoaded !== true) {
      return (
        <div className="TelesessionPanels">
          <div className="telesession-panel panel" onMouseEnter={this.handleMouseDidEnter} onMouseLeave={this.handleMouseDidLeave}>
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
          <VisavIcon type="call-patient" onClick={this.handleCallPatient} className="btn-call btn-overlay"/>
          <VisavIcon type={this.state.muteMic ? 'muted-self' : 'unmuted-self'} onClick={this.handleToggleMuteMic} className="btn-mute-mic btn-overlay" />
          <VisavIcon type={this.state.muteSubscriber ? 'muted-subscriber' : 'unmuted-subscriber'} onClick={this.handleToggleMuteSubscriber} className="btn-mute-subscriber btn-overlay" />
        </div>
        :
        <div className="vertical-control-panel panel">
          <VisavIcon type="start-telesession" onClick={this.createSession.bind(this)} className="btn-create"/>
        </div>;

      return (
        <div className="TelesessionPanels">
          <div className="telesession-panel panel" onMouseEnter={this.handleMouseDidEnter} onMouseLeave={this.handleMouseDidLeave}>
            <div className="video-container">
              <div className={isActiveSub ? 'publisher-container thumb':'publisher-container full'} >
                <section ref="publisherSection"  />
              </div>
              <div className={isActiveSub ? 'subscriber-container full':'subscriber-subscriber hidden'}>
                <section ref="subscriberSection"  />
              </div>
            </div>
            <VideoFeedback data={this.state.feedback} />
          </div>
          { controlPanel }
        </div>
      );
    }
  }
};

export default TelesessionPanels;

