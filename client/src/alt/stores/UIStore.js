import alt from '../alt';
import UIActions from '../actions/UIActions';

class UIStore {
  constructor() {
    this.alertElements = [];
    this.alertDisplayed = false;
    
    this.bindListeners({
      handleDisplayAlert: UIActions.DISPLAY_ALERT
    });
  }

  handleDisplayAlert(element) {
    this.alertElements.push(element);

    this.createSessionResponse = response.data;

    if (response.data.session) {
      this.sessionId = response.data.session.sessionId;
      this.token = response.data.token;
    }
  }

}

export default alt.createStore(UIStore, 'UIStore');