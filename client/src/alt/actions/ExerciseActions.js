import alt from '../alt'

class ExerciseActions {
  getExercises(){
    return function (dispatch) {
      return fetch(
        process.env.API_ROOT+'api/exercises/get', 
        {
          headers: new Header({ 'Accept': 'application/json', 'Content-Type': 'application/json' })
        }
      ).then(responseObject => responseObject.json())
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
}
export default alt.createActions(ExerciseActions);