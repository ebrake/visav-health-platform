import alt from '../alt'
import AccountStore from '../stores/AccountStore'

class TelesessionActions {


  createSession(){
    return function (dispatch) {
      return  fetch(
        process.env.API_ROOT + 'api/Telesessions/createSession', 
        {
          method: 'POST', 
          headers: new Header({
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({}) 
        }
      ).then(responseObject => responseObject.json())
      .then(response => {
        return dispatch(response);

      })
      .catch((err) => {
        return dispatch(err);
      });
    }
  }




}
export default alt.createActions(TelesessionActions);