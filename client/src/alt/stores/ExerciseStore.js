var alt = require('../alt');
var ExerciseActions = require('../actions/ExerciseActions');

class ExerciseStore {
  constructor() {
    this.exercises = [];

    this.bindListeners({
      handleGetExercises: ExerciseActions.GET_EXERCISES,
    });
  }

  handleGetExercises(exercises) {
    this.exercises = exercises;
  }
}

module.exports = alt.createStore(ExerciseStore, 'ExerciseStore');