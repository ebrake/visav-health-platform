import alt from '../alt'

class HealthEventActions {
  getHealthEvents(id){
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/healthevents/get?person='+id+'', {
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
      })
      .then(response => response.json())
      .then(response => {
        if (response.data.status === 'success') {
          return dispatch(response.data.healthEvents);
        } else { 
          return dispatch([]);
        }
      })
      .catch((err) => {
        return dispatch([]);
      })
    };
  }

  dataUpdated() {
    console.log("HealthEvent data live-updated..")
    return new Date();
  }
}
export default alt.createActions(HealthEventActions);