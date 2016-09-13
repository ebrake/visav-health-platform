import alt from '../alt';
import TelesessionActions from '../actions/TelesessionActions';

class TelesessionStore {

  constructor() {

    this.bindListeners({
      handleCreateSession: TelesessionActions.CREATE_SESSION,
      handleBroadcastChat: TelesessionActions.BROADCAST_CHAT,
      handleSendChatMessage:  TelesessionActions.SEND_CHAT_MESSAGE,
      handleSetActiveSession: TelesessionActions.SET_ACTIVE_SESSION,
    });

  }

  handleCreateSession(response) {
    this.createSessionResponse = response;

    if (response.session) {
      this.sessionId = response.session.sessionId;
      this.token = response.token;
    }
  }

  handleSetActiveSession(session) {
    this.activeSession = session;
  }

  handleBroadcastChat(event) {
    console.log("Chat event sent from connection " + event.from.id + " :");
    /** Assign a unique id to each event
     * (Useful in React; Each child in an array or iterator should have a unique "key" prop)
      {@link https://facebook.github.io/react/docs/multiple-components.html#dynamic-children|More Information}
    */
    if (!event.id) {
      event.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
    }
    console.log(event);
    this.chatEvents ? this.chatEvents.push(event) : this.chatEvents = [event];
  }

  handleSendChatMessage(message) {
    this.messageToSend = message;
  }

}

export default alt.createStore(TelesessionStore, 'TelesessionStore');
