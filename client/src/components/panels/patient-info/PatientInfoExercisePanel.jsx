import React, { Component } from 'react';
import HealthEventStore from '../../../alt/stores/HealthEventStore';
import ExerciseStore from '../../../alt/stores/ExerciseStore';

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
    var healthEventIsDemo;
    if (this.state.lastHealthEvent && this.state.lastHealthEvent.isDemo) {
      healthEventIsDemo = 
      <li>This health event was generated pseudo-randomly. It is not real.</li>
    }
    var exerciseIsDemo;
    if (this.state.lastExercise && this.state.lastExercise.isDemo) {
      exerciseIsDemo = 
      <li>This exercise was generated pseudo-randomly. It is not real.</li>
    }
    return (
      <div className="PatientInfoExercisePanel panel">
        
        <h2 className="title">Last Exercise</h2>
        <ul id="exercise-info-list">
          <li>Type: {this.state.lastExercise.type}</li>
          <li>Date: {(new Date(this.state.lastExercise.date)).toLocaleString()}</li>
          <li>Exercise length: {(Number(this.state.lastExercise.duration)/1000).toFixed(1)} seconds</li>
          {exerciseIsDemo}
        </ul>

        <h2 className="title">Last Health Event</h2>
        <ul id="health-event-info-list">
          <li>Type: {this.state.lastHealthEvent.type}</li>
          <li>Intensity: {(this.state.lastHealthEvent.intensity*10).toFixed(1)}</li>
          <li>Perceived Trend: {this.state.lastHealthEvent.perceivedTrend}</li>
          <li>Date: {(new Date(this.state.lastExercise.date)).toLocaleString()}</li>
          {healthEventIsDemo}
        </ul>

      </div>
    );
  }
};

PatientInfoExercisePanel.propTypes = {
  patient: React.PropTypes.object
};

export default PatientInfoExercisePanel;

