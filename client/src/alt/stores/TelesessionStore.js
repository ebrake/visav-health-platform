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
    this.createSessionResponse = response.data;

    if (response.data.session) {
      this.sessionId = response.data.session.sessionId;
      this.token = response.data.token;
    }
  }

}

export default alt.createStore(TelesessionStore, 'TelesessionStore');