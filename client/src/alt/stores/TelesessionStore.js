import alt from '../alt';
import TelesessionActions from '../actions/TelesessionActions';

class TelesessionStore {
  constructor() {
    this.healthEvents = [];

    this.bindListeners({
      handleCreateSession: TelesessionActions.CREATE_SESSION
    });
  }

  handleCreateSession(response) {
    this.createSessionResponse = response;

    if (response.session) {
      this.sessionId = response.session.sessionId;
      this.token = response.token;
    }
  }

}

export default alt.createStore(TelesessionStore, 'TelesessionStore');