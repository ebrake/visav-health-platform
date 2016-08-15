var alt = require('../alt');
var ExerciseActions = require('../actions/ExerciseActions');

class ExerciseStore {
  constructor() {
    this.exercises = [];
    this.displayedExercise = undefined;
    this.bindListeners({
      handleGetExercises: ExerciseActions.GET_EXERCISES,
      handleDisplayedExercise: ExerciseActions.GET_EXERCISES
    });
  }

  handleGetExercises(exercises) {
    this.exercises = exercises;
  }
  handleDisplayedExercise(exercises) {
    if (exercises.length>0) {
      for(var i = 0; i<exercises.length; i++){
        if (exercises[0].reps.length > 0) {
          this.displayedExercise = exercises[i];
          return;
        }
      }
      this.displayedExercise = exercises[0];
    }
  }
}

module.exports = alt.createStore(ExerciseStore, 'ExerciseStore');