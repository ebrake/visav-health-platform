import alt from '../alt';
import UIActions from '../actions/UIActions';

class UIStore {
  constructor() {
    this.alertElements = [];
    this.alertDisplayed = false;

    this.bindListeners({
      handleDisplayAlert: UIActions.DISPLAY_ALERT,
      handleRemoveAlert: UIActions.REMOVE_ALERT,

    });
  }

  handleDisplayAlert(element) {
    this.alertElements.push(element);
  }

  handleRemoveAlert(element) {
    console.log('removing');
    for(var index in this.alertElements){
      if (this.alertElements[index] == element) {
        console.log('element found');
        this.alertElements.splice(index, 1);
        console.dir(this.alertElements);
      }
    }
    
    //this.alertElements.push(element);
  }

}

export default alt.createStore(UIStore, 'UIStore');