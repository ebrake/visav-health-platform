import alt from '../alt';
import { config } from 'react-loopback';
import moment from 'moment';
import AccountStore from '../../alt/stores/AccountStore';
import TelesessionActions from '../actions/TelesessionActions';
import CircularJSON from 'circular-json-es6';

const connStates = {
  NO_SESSION_EXISTS : 0,
  GOT_SESSION_ID : 1,
  CONNECTING : 2,
  CONNECTED: 3,
  DISCONNECTED: 4
}

/** Telesession Store */
class TelesessionStore {

  constructor() {

    this.bindListeners({
      handleCreateSession: TelesessionActions.CREATE_SESSION,
      handleReceivedChat: TelesessionActions.RECEIVED_CHAT,
      handleSendChat:  TelesessionActions.SEND_CHAT
    });

    this.exportPublicMethods({
      connectToSession: this.connectToSession,
      disconnectFromSession: this.disconnectFromSession
    });

    this.connectionState=TelesessionStore.connStates.NO_SESSION_EXISTS;

  }

  /**
   * Called when a session ID & token is created
   * @param {Object} response VISAV Session response
  */
  handleCreateSession(response) {

    this.createSessionResponse = response.data;

    if (response.data.session) {
      this.sessionId = response.data.session.sessionId;
      this.token = response.data.token;
      this.connectionState=TelesessionStore.connStates.GOT_SESSION_ID;
    }
  }

  connectToSession(publisher) {
    if (!this.state.sessionId) {
      console.log('No Session ID to connect to');
      return;
    }
    if (this.state.connectionState==TelesessionStore.connStates.CONNECTING || this.state.connectionState==this.connStates.CONNECTED) return;
    this.state.connectionState=TelesessionStore.connStates.CONNECTING;
    
    // Initialize OpenTok
    var session = OT.initSession(config.get('OPENTOK_API_KEY'), this.state.sessionId);
    var self = this;

    // Connect to OpenTok
    session.connect(this.state.token, function (error) {
      if (error) return console.log('There was an error connecting to the session:', error.code, error.message);
      self.state.activeSession=session;
      self.state.connectionState=TelesessionStore.connStates.CONNECTED;
      if (publisher) {
        // Attach publisher to connected session
        session.publish(publisher)
        .on({
          streamCreated: function(event) {
            console.log("Publisher started streaming.");
          },
          streamDestroyed: function(event) {
            console.log("Publisher stopped streaming.");
          }
        });
        self.state.activePublisher=publisher;

      }
      // Notify listeners about the change
      self.emitChange();

    })
    .on({
      connectionDestroyed: function(event) {
        if (event.connection.connectionId != session.connection.connectionId) {
          console.log('Another client disconnected.');
        }
      },
      connectionCreated: function(event) {
        if (event.connection.connectionId != session.connection.connectionId) {
          console.log('Another client connected.');
        }
      },
      // Bind a listener to route incoming chat events
      "signal:chat": function(event) {
        TelesessionActions.receivedChat(event);
      }
    });
    return session;
  }

  disconnectFromSession() {
    if (this.state.activeSession) {
      this.state.activeSession.unpublish(this.state.activePublisher);
      this.state.activeSession.disconnect();
      this.state.activeSession=null;
      this.state.activePublisher=null;
    }
    this.state.chatEvents = [];
    this.state.connectionState=TelesessionStore.connStates.DISCONNECTED;
    this.emitChange();
  }

  /**
   * Handles incoming chat message signals from TelesessionActions
   * and saves to `this.chatEvents
   * @param {Object} event OpenTok Signal Event object
  */
  handleReceivedChat(event) {
    console.log("Chat event sent from connection " + event.from.id + " :");
    /** Assign a unique id to each event
     * (Useful in React; Each child in an array or iterator should have a unique "key" prop)
     * {@link https://facebook.github.io/react/docs/multiple-components.html#dynamic-children|More Information}
    */
    if (!event.id) {
      event.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
    event.fromMe = event.from.connectionId === this.activeSession.connection.connectionId;
    console.log(event);
    this.chatEvents ? this.chatEvents.push(event) : this.chatEvents = [event];
  }

  /**
   * Handles chat message sending from TelesessionActions
   * and sends OpenTok signal via this.activeSession
   * @param {string} message Message text
  */
  handleSendChat(message) {
    var user = AccountStore.getState().user;
    if (!message) return console.log("Err: no message");
    if (!this.activeSession) return console.log("Err: no activeSession");
    this.activeSession.signal(
      {
        data:JSON.stringify({
          email: user.email,
          message: message,
          firstName: user.firstName,
          lastName: user.lastName,
          date: moment().format()
        }),
        type:"chat"
      },
      function(error) {
        if (error) console.log("signal error (" + error.code + "): " + error.message);
        else console.log("signal sent.");
      }
    );
  }

}

TelesessionStore.config = {

  /*
   * Override onSerialize/onDeserialize;
   * Stringify objects that can't be serialized directly,
   * use CircularJSON library
  */

  onSerialize: (data) => {
    var obj = CircularJSON.parse(CircularJSON.stringify(data));
    if (obj.activeSession) delete obj.activeSession;
    if (obj.activePublisher) delete obj.activePublisher;
    var serializeObjs = ["chatEvents"];
    serializeObjs.forEach(function(foundObj) {
      if (data[foundObj])
        obj[foundObj] = CircularJSON.stringify(data[foundObj]);
    });
    return obj;
  },

  onDeserialize: (data) => {
    var obj = CircularJSON.parse(CircularJSON.stringify(data));
    if (obj.activeSession) delete obj.activeSession;
    if (obj.activePublisher) delete obj.activePublisher;
    var deserializeObjs = ["chatEvents"];
    deserializeObjs.forEach(function(foundObj) {
      if (data[foundObj])
        obj[foundObj] = CircularJSON.parse(data[foundObj]);
    });
    return obj;
  }

}

TelesessionStore.connStates = connStates;

export default alt.createStore(TelesessionStore, 'TelesessionStore');
