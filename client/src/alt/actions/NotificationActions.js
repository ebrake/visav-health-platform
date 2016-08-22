import alt from '../alt'
import AccountStore from '../stores/AccountStore'

class NotificationActions {
  callSelf(){
    return function (dispatch) {
      let accountState = AccountStore.getState();
      let userId = accountState.user.id;
      return fetch(
        process.env.API_ROOT+'api/Telesessions/callUser', 
        {
          method: 'POST', 
          headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
          body: JSON.stringify({
            userId: userId
          })
        }
      ).then(responseObject => responseObject.json())
      .then(response => {
        console.log('flag3');
        if (response.data.status === 'success') {
          return dispatch(response.data.exercises);
        } else { 
          return dispatch([]);
        }
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