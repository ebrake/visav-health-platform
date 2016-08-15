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


  exerciseChartData(exercises){
    let dataArray = [];
    if (exercises.length > 0) {
      name = exercises[0].type;
      for(var i = 0; i < exercises.length; i++){

        let pointDict = {};
        if (exercises[i].reps.length > 0) {
          pointDict['value'] = this.avgValueForExercise(exercises[i]);
          pointDict['unit'] = exercises[i].reps[0].unit;//assumes all reps have same unit for one exercise
          pointDict['date'] = exercises[i].date;
        }
        else{
          pointDict['value'] = 0;
          pointDict['unit'] = 'NO REPS';
          pointDict['date'] = new Date();
        }
        pointDict['index'] = i;
        pointDict['exerciseName'] = exercises[i].type;
        dataArray.append(pointDict);
      }
    }
    return dataArray;
  }

  avgValueForExercise(exercise){
    if (exercise.reps.length > 0) {
      let avg = 0;
      for(var i = 0; i < exercise.reps.length; i++){
        avg += exercise.reps[i].value / exercise.reps.length;
      }
      return avg;
    }
    else{
      return 0;
    }
  }

  
}
export default alt.createActions(ExerciseActions);