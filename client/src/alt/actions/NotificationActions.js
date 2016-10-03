import alt from '../alt'
import AccountStore from '../stores/AccountStore'

class NotificationActions {
  callSelf(sessionId){
    return function (dispatch) {
      let accountState = AccountStore.getState();
      let userId = accountState.user.id;
      return fetch(process.env.API_ROOT+'api/Telesessions/callUser', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId: userId,
          sessionId: sessionId
        })
      })
      .then(response => response.json())
      .then(response => {
        // do something with response if we want
      })
      .catch((err) => {
        console.log('error:');
        console.dir(err);
        return dispatch([]);
      })
    };
  }

  callUser(sessionId, userId){
    console.log('calling patient with userId: ' + userId);
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/Telesessions/callUser', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          userId: userId,
          sessionId: sessionId
        })
      })
      .then(response => response.json())
      .then(response => {
        // do something with response if we want
        console.log('response from calling patient with userId: ' + userId);
        console.dir(response);

      })
      .catch((err) => {
        console.log('error:');
        console.dir(err);
        return dispatch([]);
      })
    };
  }
}
export default alt.createActions(NotificationActions);