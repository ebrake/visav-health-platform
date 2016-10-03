import alt from '../alt'

class UIActions {
  displayAlert(element){
    return function (dispatch) {
      dispatch(element);  
    }
  }
}

export default alt.createActions(UIActions);
