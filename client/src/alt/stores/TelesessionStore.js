import alt from '../alt';
import TelesessionActions from '../actions/TelesessionActions';

class TelesessionStore {

  constructor() {

    this.bindListeners({
      handleCreateSession: TelesessionActions.CREATE_SESSION,
      handleBroadcastChat: TelesessionActions.BROADCAST_CHAT
    });

  }

  handleCreateSession(response) {
    this.createSessionResponse = response;

    if (response.session) {
      this.sessionId = response.session.sessionId;
      this.token = response.token;
    }
  }

  handleBroadcastChat(event) {
    console.log("Chat event sent from connection " + event.from.id + " :");
    console.log(event);
    this.chatEvents ? this.chatEvents.push(event) : this.chatEvents = [event];
  }

}

export default alt.createStore(TelesessionStore, 'TelesessionStore');
