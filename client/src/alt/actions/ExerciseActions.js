import alt from '../alt'

class ExerciseActions {
  getExercises(id){
    return function (dispatch) {
      return fetch(process.env.API_ROOT+'api/exercises/get?person='+id+'', {
        headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
      })
      .then(response => response.json())
      .then(response => {
        if (response.data.status === 'success') {
          return dispatch(response.data.exercises);
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
    console.log("Exercise data live-updated..")
    return true;
  }

}
export default alt.createActions(ExerciseActions);