import alt from '../alt'
import responseUtil from '../../components/utils/responseUtil';
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
        dispatch(response);
        return response;
      })
      .catch((err) => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
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
        dispatch(response);
        return response;
      })
      .catch((err) => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
      })
    };
  }

  requestPatientGeneratedReport(patientId) {
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/reports/requestPGR', {
        method: 'POST', 
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' }),
        body: JSON.stringify({
          patientId: patientId
        })
      })
      .then(response => response.json())
      .then(response => {
        dispatch(response);
        return response;
      })
      .catch((err) => {
        let craftedResponse = responseUtil.craftErrorResponse(err);
        dispatch(craftedResponse);
        return craftedResponse;
      })
    };
  }
}

export default alt.createActions(NotificationActions);