import alt from '../alt';
import moment from 'moment';
import AccountStore from '../../alt/stores/AccountStore';
import TelesessionActions from '../actions/TelesessionActions';

/** Telesession Store */
class TelesessionStore {

  constructor() {

    this.bindListeners({
      handleCreateSession: TelesessionActions.CREATE_SESSION,
      handleReceivedChat: TelesessionActions.RECEIVED_CHAT,
      handleSendChat:  TelesessionActions.SEND_CHAT,
      handleSetActiveSession: TelesessionActions.SET_ACTIVE_SESSION,
    });

  }

  /**
   * Called when a session ID & token is created
   * @param {Object} response VISAV Session response
  */
  handleCreateSession(response) {
    this.createSessionResponse = response;

    if (response.session) {
      this.sessionId = response.session.sessionId;
      this.token = response.token;
    }
  }

  /**
   * Called when an OpenTok session is initialized
  */
  handleSetActiveSession(session) {
    this.activeSession = session;
    if (!session) {
      // Disconnected
      this.chatEvents = [];
      return;
    }
    // Bind a listener to route incoming chat events
    session.on({
      "signal:chat": function (event) {
        TelesessionActions.receivedChat(event);
      }
    });
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

export default alt.createStore(TelesessionStore, 'TelesessionStore');
