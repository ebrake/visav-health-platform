import React from 'react';
import NotificationActions from '../../alt/actions/NotificationActions';
import TelesessionActions from '../../alt/actions/TelesessionActions';
import TelesessionStore from '../../alt/stores/TelesessionStore';
import VideoFeedback from '../misc/VideoFeedback';
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
      sessionRequested: false,
      feedback: {
        mode: 'initial'
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
      this.setState({ 
        sessionRequested: true,
        feedback: {
          mode: 'hidden'
        }
      });
      TelesessionActions.createSession();
    }
  }

  handleCallPatient() {
    this.setState({
      feedback: {
        mode: 'calling'
      }
    });

    NotificationActions.callUser(TelesessionStore.getState().sessionId, this.props.patient.id)
    .then(function(response){
      if (response.data.status === 'failure') {
        this.setState({
          feedback: {
            mode: 'error',
            message: response.data.message,
            error: response.data.error
          }
        })
      }
    }.bind(this))
  }

  connectToSession() {
    var self = this;

    //eslint-disable-next-line
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
          activeSubscriber: subscriber,
          feedback: {
            mode: 'hidden'
          }
        });
        console.log('Subscribed to stream: ' + event.stream.id)
      },
      streamDestroyed: function(event) {
        self.disconnectFromSession();
        console.log("Stream " + event.stream.name + " ended. " + event.reason);
      }
    });

  }

  disconnectFromSession(){
    if (TelesessionStore.getState().activeSession !== null) {
      TelesessionStore.disconnectFromSession();
      this.setState({
		    activeSubscriber: null,
        sessionRequested: false,
        feedback: {
          mode: 'callEnded'
        }
      });
    }
  }

  telesessionChanged(telesessionState) {
    let connStates = TelesessionStore.connStates;

    if (this.state.connectionState !== telesessionState.connectionState) {
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

  handleToggleMuteMic(){
    var newVal = !this.state.muteMic;
    this.setState({muteMic: newVal});

    if (TelesessionStore.getState().activePublisher) {
      //publishAudio is opposite of mute
      TelesessionStore.getState().activePublisher.publishAudio(!newVal);
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
    let isActiveSub = (this.state.activeSubscriber != null);
    let isActiveSession = (TelesessionStore.getState().activeSession != null);

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
    else {
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

