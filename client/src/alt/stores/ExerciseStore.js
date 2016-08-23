import alt from '../alt'
import ExerciseActions from '../actions/ExerciseActions';

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
    if (exercises.length > 0) {
      for (var i = 0; i < exercises.length - 1; i++) {
        if (exercises[i].reps.length > 0) {
          this.displayedExercise = exercises[i];
          return;
        }
      }
    }
    this.displayedExercise = undefined;
  }
}

export default alt.createStore(ExerciseStore, 'ExerciseStore');