import React from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';
import InfoList from '../../lists/InfoList'

class PatientInfoExercisePanel extends React.Component {
  constructor(props) {
    super(props);
    let healthEventState = HealthEventStore.getState();
    let exerciseState = ExerciseStore.getState();

    this.state = {
      lastExercise: exerciseState.exercises[exerciseState.exercises.length - 1] || {},
      lastHealthEvent: healthEventState.healthEvents[healthEventState.healthEvents.length - 1] || {}
    };

    this.healthEventsChanged = this.healthEventsChanged.bind(this);
    this.exercisesChanged = this.exercisesChanged.bind(this);
  }

  healthEventsChanged(healthEventState){
    this.setState({
      lastHealthEvent: healthEventState.healthEvents[healthEventState.healthEvents.length - 1] || {}
    });
  }

  exercisesChanged(exerciseState){
    this.setState({
      lastExercise: exerciseState.exercises[exerciseState.exercises.length - 1] || {}
    });
  }

  componentDidMount(){
    ExerciseStore.listen(this.exercisesChanged);
    HealthEventStore.listen(this.healthEventsChanged);
  }

  componentWillUnmount(){
    ExerciseStore.unlisten(this.exercisesChanged);
    HealthEventStore.unlisten(this.healthEventsChanged);
  }

  render() {
    var healthEventInfoDict = {
      'Type': this.state.lastHealthEvent.type,
      'Date': (new Date(this.state.lastHealthEvent.date)).toLocaleString(),
      'Perceived Trend': this.state.lastHealthEvent.perceivedTrend
    }

    if (this.state.lastHealthEvent && this.state.lastHealthEvent.isDemo) {
      healthEventInfoDict['Demo'] = 'This health event was generated pseudo-randomly. It is not real.';
    }

    var exerciseInfoDict = {
      'Type': this.state.lastExercise.type,
      'Date': (new Date(this.state.lastExercise.date)).toLocaleString(),
      'Exercise Length': (Number(this.state.lastExercise.duration)/1000).toFixed(1) + ' seconds'
    }

    if (this.state.lastExercise && this.state.lastExercise.isDemo) {
      exerciseInfoDict['Demo'] = 'This exercise was generated pseudo-randomly. It is not real.';
    }

    return (
      <div className="PatientInfoExercisePanel panel">
        <h2 className="title">Last Exercise</h2>
        <InfoList infoDict={ exerciseInfoDict } />

        <h2 className="title">Last Health Event</h2>
        <InfoList infoDict={ healthEventInfoDict } />
      </div>
    );
  }
};

PatientInfoExercisePanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoExercisePanel;

